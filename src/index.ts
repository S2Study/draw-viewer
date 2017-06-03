import * as drawchat from "@s2study/draw-api";

import DrawchatRenderer = drawchat.renderer.DrawchatRenderer;
import DrawHistory = drawchat.history.DrawHistory;
import {DrawViewer} from "./DrawViewer";

export class ViewerFactory {
	static createInstance(
		history: DrawHistory,
		renderer: DrawchatRenderer
	): DrawViewer {
		return new DrawViewer(history, renderer);
	}
}
export default ViewerFactory;