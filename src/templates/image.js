import { html } from "lit-html";
import { renderImage } from "./directives/image.js";

export default (o) => html`${renderImage(o.url)}`;
