import DrawchatViewer = drawchat.viewer.DrawchatViewer;
import DrawchatRenderer = drawchat.renderer.DrawchatRenderer;
import DrawHistory = drawchat.core.DrawHistory;
import {Viewer} from "./Viewer";
export function createInstance(
	history:DrawHistory,
	renderer:DrawchatRenderer
):DrawchatViewer{
	return new Viewer(history,renderer);
}

export default createInstance;