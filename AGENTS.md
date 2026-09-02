# AI 协作规则

本仓库是 **支付弹窗 H5 Demo**（Figma 760:2674），与页面电梯项目相互独立。

## 技术约束

- Vue 2.7 + `<script setup>` Composition API，禁止 mixins。现网未迁完前不要改成 Vue3。
- 通用表单、按钮、空态、弹层优先用 Element UI。
- 视觉变量只写在 `src/shared/styles/tokens.css`，业务组件不要堆砌魔法数字。
- 固定文案放 `src/features/payment/data/copy.ts`，可变数据放 `data/mock.ts`。

## 结构

- `src/app/`：应用壳、预览画幅。
- `src/shared/`：无业务耦合的样式、工具、通用 UI。
- `src/features/payment/`：支付弹窗模块，含组件、状态、Mock、切图。

## 弹窗行为

- 预览宽度 `< 768px`：底部弹窗（Phone）。
- 预览宽度 `>= 768px`：600px 居中弹窗（Pad）。
- 同一 `PaymentDialog`，仅 placement 不同。

## 不要做

- 不要把 Demo 里的虚构支付接真实接口。
- 不要删除 Debug 窗口的状态切换，除非明确交付生产包。
- 不要把电梯或其他 Feature 重新耦合进本仓库。
