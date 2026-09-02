# 支付弹窗 H5 Demo

基于 Figma [760:2674](https://www.figma.com/design/uBUKgEDv5WWIou2XWG2oQE/) 的支付 / 订单流程 Demo。本仓库不再包含页面电梯。

- **Phone**（预览宽度 `< 768px`）：底部弹窗，无描边
- **Pad**（预览宽度 `>= 768px`）：600px 居中弹窗，`0.5px` 描边
- Mock 数据 + Debug 面板验证全流程（含 Loading / 失败兜底页）

## 本地运行

```bash
npm install
npm run dev
```

开发服务默认：`http://127.0.0.1:45217`（本仓库唯一预览地址，不要用 45218）。

```bash
npm run build
npm run preview
```

GitHub 预览（静态 `docs/`）：https://oulun-muller.github.io/lz-Mobile-payment-popup/

## 怎么看

1. 默认预览宽度 **412**（Phone）：点击右下角 **立即支付**，底部弹出确认页。
2. 打开左下角 **Debug**，把预览宽度切到 **800**（Pad）：弹窗改为 600px 居中。
3. Debug 可切换 Mock（Normal / Empty / Loading / Error / Long Text / Long List / Boundary / Abnormal）和支付步骤。
4. Empty / Error / Boundary / Abnormal 为同一套失败兜底（手柄图 +「页面加载失败」+「刷新」）；Loading 为转圈 +「正在加载中」。

## 技术栈

- Vue 2.7（Composition API，无 mixins；对齐现网 Vue2，未用 Vue3）
- Vite + TypeScript
- Element UI（按钮、弹窗、Tag、Radio、Switch、Message）
- 失败兜底 / 付款方式 / 明细卡等按稿面自定义
- Design Tokens：`src/shared/styles/tokens.css`

## 目录

```text
src/
├── app/                         应用壳与预览画幅
├── shared/                      样式、通用 UI、视口工具
└── features/payment/            支付模块
    ├── components/              弹窗与步骤区块
    ├── state/                   usePayment、placement
    ├── data/                    文案与 Mock
    ├── assets/                  Figma 导出图标与示意图
    └── PaymentDemo.vue
```

更完整的交付说明见 `DELIVERY.md`。
