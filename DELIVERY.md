# 交付说明

## 项目启动

```bash
npm install
npm run dev
```

访问 `http://127.0.0.1:45217`。默认画幅 412px。左下角 Debug 可切换预览宽度、Mock 状态与支付步骤。

给开发看实现：clone GitHub 仓库后同样 `npm install && npm run dev` 即可，不依赖 GitHub Actions。

静态预览：https://oulun-muller.github.io/lz-Mobile-payment-popup/（`main` 上的 `docs/`，不是 workflow 自动发布）。

## 页面还原范围

已还原 Figma 节点 `760:2674` 的支付弹窗流程（确认稿 `850:4074`，激活说明 `863:11824`）。落地页仅作为打开弹窗的演示背景：

| 步骤 | 实现 |
| --- | --- |
| 确认支付 | 金额、订单明细、独立「付款方式」块（微信 / 支付宝），与「立即支付」间距 40px（方法区下 24px + 底栏上 16px） |
| 扫码支付 | 未安装钱包时进入二维码页，随后进入等待 |
| 等待支付 / 分配激活码 | 加载态文案与旋转图标 |
| 成功 | 激活码、订单号可复制；写入剪贴板成功才出 Toast，失败提示「复制失败」 |
| 失败 | 支付失败提示 + 返回（流程内失败，不是页面兜底） |
| 激活方式 | 可滚动说明、Steam 外链与示意图；步骤分隔为渐变线 |

落地「请【登录】」仅提示 Demo 未接登录，不是真实账号流程。

## 适配范围

- 设计基准：Phone `412`、Pad `800`
- Debug 可切换：`375 / 390 / 412 / 414 / 430 / 768 / 800 / 834 / 1024` 与铺满
- Phone / Pad 判定：预览宽度 `< 768px` 底部弹窗，`>= 768px` 居中 600px
- 登录区与吸底「立即支付」使用 `safe-area-inset-top / bottom`

## 组件库

Vue 2.7 + Element UI 全量注册（规范：现网仍是 Vue2，禁止 mixins）。已用于：

- `el-dialog`：支付弹窗容器
- `el-button`：落地页登录 / 立即支付、Debug
- `el-tag`、`el-switch`、`el-radio`、`el-message`

以下保留自定义，因为设计稿几何与 Element 默认控件差异较大：

- 付款方式卡片、金额区、明细卡、成功 / 支付失败 / 激活步骤
- 页面 Loading 与失败兜底（手柄空态图，不用 `el-empty`）
- 复制成功 Toast（需连点下推，不能用单槽 Message）
- 弹窗内 54px 主 / 次按钮（稿面高度与圆角与 `el-button` 不一致）

## Design Tokens

`src/shared/styles/tokens.css`

含颜色、字号、间距、圆角、阴影、z-index、支付弹窗几何、断点与安全区。Element 主题覆盖在 `src/shared/styles/element-theme.css`。

确认页付款方式上下内边距：`--payment-methods-pad-y`（24px）。

## 文案与 Mock

- 固定文案：`src/features/payment/data/copy.ts`（含明细 Label）
- Mock：`src/features/payment/data/mock.ts`（`isFailPageMock` 判定兜底态）
- 激活说明：`src/features/payment/data/activation.ts`

覆盖 Normal / Empty / Loading / Error / Long Text / Long List / Boundary / Abnormal。

Loading、Empty / Error / Boundary / Abnormal 不对用户展示落地「立即支付」：

- Loading：转圈 +「正在加载中」
- Empty / Error / Boundary / Abnormal：同一套兜底（`icon-page-empty.svg` +「页面加载失败」+「刷新」→ 回到 Normal）

Debug 仍可强制打开弹窗，用来确认异常数据下的弹窗表现。

## Debug 窗口

固定在左下角（规范默认右下角；本 Demo 右下是吸底「立即支付」，放右侧会挡操作），默认折叠。层级 `--z-debug: 200`，低于支付弹层 `--z-payment: 350`。

`npm run build` 也会带上 Debug（Demo 包；正式现网包再拆）。可查看视口、设备、断点、弹窗布局、组件库、资源加载，并切换预览宽度、Mock 状态、支付步骤、钱包安装与支付结果。

现网对接时：不挂 `DebugPanel`；`usePayment` 去掉 `forceStep` / Mock `walletInstalled` / `outcome`，改接真实支付结果。步骤枚举本身是产品流程，可以留。

## 资源与切图

| 资源 | 用途 |
| --- | --- |
| `icon-wechat.svg` / `icon-alipay.svg` | 付款方式 |
| `icon-copy.svg` / `icon-close.svg` / `icon-back.svg` | 操作图标 |
| `icon-page-empty.svg` | 失败兜底 |
| `mock-qrcode.png` | 演示二维码 |
| `activation-step*.png` | 激活步骤示意图 |
| `landing-hero.jpg` | 落地背景（由设计长图压缩为 JPEG） |

图标来自 Figma 导出。金额、按钮、分割线用代码实现，未切成图。

## 已完成

- Phone 底部弹窗 / Pad 居中弹窗（Pad 用 box-shadow 画 0.5px 描边）
- 确认 → 扫码 / 等待 → 成功或失败 → 激活方式
- 确认页付款方式独立块；明细与方法同列，四行时不出现多余滚动
- Mock 八态 + 失败兜底 + Debug 切换
- Tokens 与模块化目录
- 复制 Toast 连点下推；仅剪贴板写入成功后提示

## 未完成

- 未接真实订单、支付、登录、权限、埋点
- 无自动化视觉回归
- 付款方式未做「未选择不可支付」（稿面默认已选微信）
- GitHub 仓库无 Actions workflow（当前 token 无 `workflow` 权限）；Pages 靠提交 `docs/`

## 已知限制

- Demo 订单、激活码、游戏名均为虚构，不含真实用户信息
- 本机若无微软雅黑，会回退到 PingFang / Noto Sans SC；金额数字优先 Roboto / 系统数字字体
- 弹窗 `position: absolute` 相对 H5 画幅，而不是浏览器窗口；这是为了让预览宽度切换生效
- Debug 放在左下角，避免挡住右下角支付按钮
- Debug `forceStep` 会钉死当前步骤（例如钉在成功页时，「查看激活方式」不会切页）；验收激活请点 Debug「激活方式」或走自动流程

## 需要确认的问题

1. 未安装钱包时，扫码页停留多久再进入等待支付，产品是否有正式时长？
2. 成功页订单号是否始终展示并允许复制？
3. 生产环境金额是否可能出现小数（Boundary 已按 `0.01` 演示）？
