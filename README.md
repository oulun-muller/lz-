# lz- 支付弹窗 H5 Demo

基于 Figma [760:2674](https://www.figma.com/design/uBUKgEDv5WWIou2XWG2oQE/) 的支付/订单流程 Demo。

- **Phone**：底部弹窗
- **Pad**：居中弹窗（600px）
- Mock 数据 + Debug 面板验证全流程

## 启动

```bash
npm install
npm run dev
```

浏览器打开终端显示的地址。

## 预览

- 页面中央点击 **立即支付**
- 或 Debug 面板 → **打开支付弹窗**
- 切换预览宽度 412 / 800 验证 Phone / Pad 布局

## GitHub Pages

线上预览：<https://oulun-muller.github.io/lz-Mobile-payment-popup/>

Pages 通过 GitHub Actions 构建 `dist/` 后发布，**不要**把仓库根目录的源码直接当作 Pages 目录（浏览器无法运行 `/src/main.ts`）。

本地模拟 Pages 路径：

```bash
BASE_PATH=/lz-Mobile-payment-popup/ npm run build
npx vite preview --base /lz-Mobile-payment-popup/
```

## 目录

```
src/features/payment/   # 支付弹窗 feature
src/shared/styles/      # Design Tokens
```
