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

- 预览宽度 `< 768px`：底部弹窗（Phone），无描边。
- 预览宽度 `>= 768px`：600px 居中弹窗（Pad），描边 `--payment-dialog-border-width` / `--color-payment-dialog-border`（Figma `0.5px` `#39404d`）。
- 同一 `PaymentDialog`，仅 placement 不同。
- 确认页：付款方式是明细下方的独立块（`--payment-methods-pad-y` 24px），不要再嵌进明细列表；明细与方法放在同一列容器里，避免多一段 body gap 把四行列表挤出滚动。
- Empty / Error / Boundary / Abnormal：同一套失败兜底（手柄图 +「页面加载失败」+「刷新」），不要改回 `el-empty`。Loading 仍是转圈文案。

## 不要做

- 不要把 Demo 里的虚构支付接真实接口。
- 不要删除 Debug 窗口的状态切换，除非明确交付生产包。
- 不要把电梯或其他 Feature 重新耦合进本仓库。

## Cursor Cloud 预览

- 只认本仓库 Vite：`http://127.0.0.1:45217`（`vite.config.ts` 锁死此端口）。
- 不要再起第二套 Vite，也不要改端口。`45218` 曾是 `/tmp/lz-repo` 里 GitHub Pages 旧 clone，代码和当前分支不是同一份。
- 若 45217 已被占用，复用本仓库已有的 `payment-vite` 进程，不要另开端口。
