# 支付弹窗 H5 Demo

基于 Figma [760:2674](https://www.figma.com/design/uBUKgEDv5WWIou2XWG2oQE/) 的支付 / 订单流程 Demo。本仓库不再包含页面电梯。

- **Phone**（预览宽度 `< 768px`）：底部弹窗
- **Pad**（预览宽度 `>= 768px`）：居中弹窗（600px）
- Mock 数据 + Debug 面板验证全流程

## 本地运行

```bash
npm install
npm run dev
```

开发服务默认：`http://127.0.0.1:45217`

```bash
npm run build
npm run preview
```

## 怎么看

1. 默认预览宽度 **412**（Phone）：点击右下角 **立即支付**，底部弹出确认页。
2. 打开左下角 **Debug**，把预览宽度切到 **800**（Pad）：弹窗改为 600px 居中。
3. Debug 可切换 Mock（Normal / Empty / Loading / Error / Long Text / Long List / Boundary / Abnormal）和支付步骤。

## 技术栈

- Vue 2.7（Composition API，无 mixins；对齐现网 Vue2，未用 Vue3）
- Vite + TypeScript
- Element UI（按钮、空态、弹窗、Tag、Radio、Switch、Message）
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

## GitHub Pages

线上预览：<https://oulun-muller.github.io/lz-Mobile-payment-popup/>

发布目录为 **`docs/`**（构建后的静态文件）。Settings → Pages → **`main` / `/docs`**。

更新线上版本：

```bash
BASE_PATH=/lz-Mobile-payment-popup/ npm run build
rm -rf docs && cp -a dist docs && touch docs/.nojekyll
git add docs src && git commit -m "chore: update GitHub Pages build" && git push
```

