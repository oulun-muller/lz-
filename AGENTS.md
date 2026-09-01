# AI 协作规则

本仓库是 **支付弹窗 H5 Demo**（Figma 760:2674），独立于 page-lift 电梯项目。

## 技术约束

- Vue 2.7 + `<script setup>` Composition API，禁止 mixins。
- 通用按钮、弹层优先用 Element UI。
- 视觉变量写在 `src/shared/styles/tokens.css`。
- 固定文案放 `src/features/payment/data/copy.ts`，Mock 放 `data/mock.ts`。

## 结构

- `src/app/`：预览壳、画幅切换。
- `src/shared/`：样式、工具、Debug 面板。
- `src/features/payment/`：支付弹窗模块。

## 弹窗行为

- **Phone**（≤767px）：`placement=bottom`，底部弹窗。
- **Pad**（≥768px）：`placement=center`，600px 居中弹窗。
- 同一 `PaymentDialog` 组件，仅 placement 不同。

## 不要做

- 不要接真实支付接口。
- 不要删除 Debug 窗口，除非明确交付生产包。
