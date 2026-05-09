# WellNZ Nutrition — End-to-End Architecture

> **采集日期：** 2026-05-06
> **平台：** Next.js 15 App Router · Prisma + SQLite · NextAuth v5 · Razorpay · Zustand

---

## 1. 系统拓扑

```
Browser (Client)
├── Next.js 15 App Router (Vercel)
│   ├── Server Components (RSC) — 数据获取不过网
│   ├── Server Actions — 表单提交
│   └── Route Handlers (API Routes) — 第三方集成
├── Middleware (auth guard, ratelimit)
└── External Services
    ├── Razorpay (payments, webhooks)
    ├── Resend (transactional email)
    └── Google Fonts (CDN fonts)
```

---

## 2. 认证与会话 (NextAuth v5)

```
Request → Middleware (/api/*, /account/*, /checkout/*)
  → Check JWT cookie (next-auth.session-token)
    → Valid → attach session.user to request
    → Invalid/Expired → redirect to /login?callbackUrl=<destination>
  → Auth routes (/login, /register) → bypass
```

**会话结构：**
```typescript
interface Session {
  user: {
    id: string;          // Prisma User.id
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    emailVerified: Date | null;
  }
}
```

**JWT 策略：** 短期 access token（15min）存储在 httpOnly cookie，refresh 通过 NextAuth 内部机制。

---

## 3. 购物车 (Zustand + localStorage)

```
Client CartStore (Zustand)
├── cart: CartItem[]         // { variantId, productId, name, price, quantity, image }
├── isOpen: boolean          // drawer 开关状态
├── addItem(item)           // 乐观添加，落到 localStorage
├── removeItem(variantId)
├── updateQuantity(variantId, qty)
├── clearCart()
└── cartCount, cartTotal 计算属性

持久化：persist(localStorage) — SSR 时从 cookie 同步（避免 hydration mismatch）
Checkout 提交：POST /api/cart → 清空客户端 store
```

---

## 4. 商品与目录

```
/products                    → ProductsPage (Suspense 包裹)
  └── ProductsContent         → 产品网格 + 侧边栏分类筛选

/app/api/products             → GET (admin+public)
  Query params: ?category=&search=&minPrice=&maxPrice=&sort=

/app/api/admin/products       → CRUD (ADMIN only)
  POST /products              → createProduct
  PUT   /products/:id         → updateProduct
  DELETE /products/:id        → deleteProduct (soft delete)
```

**产品模型：**
```
Product { id, name, slug, description, basePrice, categoryId, images[], isActive }
  ↳ ProductVariant { id, productId, flavor, size, sku, inventory, priceOverride? }
  ↳ Category { id, name, slug }
```

---

## 5. 结账流程 (3-Step Stepper)

```
Step 1: Contact        → email, isGuest
Step 2: Shipping       → address form (name, line1, line2, city, state, pin, phone)
Step 3: Payment        → Razorpay rz.open()

POST /api/checkout/create-order
  Body: { cart, contact, shipping }
  Returns: { orderId, razorpayOrderId, amount, currency }
  Side-effect: 乐观库存锁定 ($transaction 扣减 inventory)
  Note: PENDING 订单在 webhook 确认前不减少库存

POST /api/checkout/verify-payment
  Body: { orderId, razorpayPaymentId, razorpayOrderId, signature }
  Verify: HMAC + amount 对账
  Update: order.status PENDING → PROCESSING
  Decrement inventory (FINAL)

POST /api/webhooks/razorpay
  Events: payment.authorized, payment.captured
  Verify: HMAC SHA-256
  Handler: 更新订单状态 PROCESSING → SHIPPED → DELIVERED
```

**Razorpay 集成（非标准旧流）：
```typescript
// 正确流程
const rz = new Razorpay({ key_id, key_secret });
rz.open({
  order_id: razorpayOrderId,
  amount,
  currency,
  name: "WellNZ Nutrition",
  description: "Order #{orderNumber}",
  handler: (response) => {
    // Webhook 确认，不要在这里操作订单
  }
});
```

---

## 6. 订单生命周期

```
PENDING (创建但未支付)
  ↓ payment.authorized webhook
PROCESSING (支付确认，库存已扣)
  ↓ admin 手动操作或自动触发
SHIPPED (已发货，有 tracking)
  ↓ 物流确认
DELIVERED
  ↓ 客户取消 / 超时
CANCELLED
  ↓ 库存释放 + 退款
REFUNDED
```

---

## 7. 邮件系统 (Resend)

```
触发点                          模板
─────────────────────────────────────────────────────
用户注册 (异步 5min 延迟检查)     WELCOME
checkout 创建订单                 ORDER_CONFIRMATION
razorpay webhook PROCESSING     PAYMENT_CONFIRMED
admin 手动发货                   SHIPPING_NOTIFICATION
forgot-password 请求             PASSWORD_RESET
```

**异步邮件模式（防止 JWT callback 阻塞）：**
```typescript
// lib/auth.ts — JWT callback 中
setTimeout(() => {
  sendWelcomeEmail(session.user.email, session.user.name)
    .catch(console.error);
}, 5 * 60 * 1000); // 5-min fire-and-forget
```

---

## 8. 管理员后台

```
/api/admin/products      → ADMIN only (role guard)
/api/admin/orders        → ADMIN only
/api/admin/orders/:id    → GET, PATCH (status, tracking)

/account                 → 用户账户中心 (auth 保护)
/account/orders         → 自己的订单列表
/account/orders/:id     → 订单详情
/account/addresses       → 收货地址 CRUD
/account/settings        → 密码修改
/account/subscription    → 订阅占位页
```

---

## 9. 安全中间层

```
Ratelimit (/api/ratelimit.ts)
  → IP 检测: x-real-ip (CF) > x-forwarded-for > request.ip
  → In-memory Map 计数（Vercel 无 Redis）
  → 限制: 20 req/min (checkout), 100 req/min (read)

HMAC Webhook (/api/webhooks/razorpay)
  → const generated_signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(body))
      .digest("hex");
  → timingSafeEqual(generated, razorpay_signature)

Password Reset Token
  → crypto.createHash("sha256")(token) 存储，hash 比较
```

---

## 10. 前台页面路由

```
/                       → Homepage (HeroSlider + 产品展示)
/products               → 产品目录 + 分类侧栏
/products/:slug         → 产品详情 (slug 驱动)
/cart                   → 购物车页
/checkout               → 3步结账 stepper
/order-confirmation/:id → 支付成功页
/about                  → 关于页 + 真实用户评价
/privacy                → 隐私政策
/terms                  → 服务条款
/account                → 账户仪表板
/account/orders         → 订单历史
/account/orders/:id     → 订单详情
/account/addresses      → 地址管理
/account/settings       → 账户设置
/account/subscription   → 订阅管理
/login                  → 登录
/register               → 注册
/forgot-password        → 忘记密码
/reset-password         → 重置密码
```

---

## 11. 技术栈一览

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript (strict) |
| Database | SQLite + Prisma ORM |
| Auth | NextAuth v5 (JWT strategy) |
| Payments | Razorpay ( rz.open() ) |
| Email | Resend |
| Cart State | Zustand (localStorage persist) |
| Styling | Tailwind CSS + botanical design tokens |
| Fonts | Playfair Display + DM Sans |
| Deployment | Vercel (preview + production) |
| Rate Limiting | In-memory (no Redis) |

---

## 12. 设计系统 (Botanical White)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#FAFAF8` | 页面背景 |
| `--primary` | `#2E7D32` | 按钮、accent、logo |
| `--sage` | `#7B9E6B` | 辅助文字、次要交互 |
| `--ink` | `#1a1a1a` | 主要文字 |
| `--border` | `rgba(46,125,50,0.15)` | 边框、分隔线 |
| Display font | Playfair Display | 标题、数字 |
| Body font | DM Sans | 正文、UI 文字 |
