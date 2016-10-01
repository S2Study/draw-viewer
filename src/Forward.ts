import * as drawchat from "@s2study/draw-api";

import DrawchatRenderer = drawchat.renderer.DrawchatRenderer;
import NamedLayer = drawchat.viewer.NamedLayer;
import LayerMap = drawchat.viewer.LayerMap;
import DrawMoment = drawchat.history.DrawMoment;

import {CheckStateUtils} from "./CheckStateUtils";
import {MapMomentUtil} from "./MapMomentUtil";
import {UpdateState, UpdateStateMap} from "./UpdateState";

/**
 * 前方向への更新
 */
export class Forward {

	/**
	 * Rendererを更新する。
	 * @param renderer
	 * @param sequencesNow
	 * @param sequencesNext
	 * @param pastMoments
	 * @param futureMoments
	 * @returns {string[]}
	 */
	static updateView(
		renderer: DrawchatRenderer,
		sequencesNow: string[],
		sequencesNext: string[],
		pastMoments: DrawMoment[],
		futureMoments: DrawMoment[]): string[] {

		let pastMap = MapMomentUtil.mapToLayerMap(pastMoments, sequencesNow);
		let layers = MapMomentUtil.mapToMomentsArray(futureMoments, sequencesNext);

		let updateStateMap = CheckStateUtils.checkState(
			sequencesNow,
			layers
		);

		// レイヤーの補完
		let sequences = Forward.complementLayer(renderer, sequencesNow, updateStateMap);

		// 表示順の変更
		renderer.sortLayer(CheckStateUtils.createSortOrder(sequences, sequencesNext));

		// 更新の反映
		let i = 0 | 0;
		let layer: NamedLayer;
		while (i < layers.length) {
			layer = layers[i];
			i = (i + 1) | 0;

			if (updateStateMap[layer.layerId] === UpdateState.NON) {
				continue;
			}
			if (
				updateStateMap[layer.layerId] === UpdateState.UPDATE
			// ||	updateStateMap[layer.layerId] === UpdateState.ADD
			) {
				renderer.renderDiff(i - 1, layer.draws);
				continue;
			}
			layer = MapMomentUtil.concatLayer(pastMap[layer.layerId], layer);
			renderer.render(i - 1, layer.draws, layer.transform, layer.clip);
		}
		return sequencesNext;
	}

	static complementLayer(
		renderer: DrawchatRenderer,
		layerIds1: string[],
		updateStateMap: UpdateStateMap): string[] {

		let layerIds: string[] = layerIds1 != null ? layerIds1 : [];
		let i = (layerIds.length - 1) | 0;
		let state: UpdateState;
		let key: string;
		let result: string[] = [];

		// 削除を抽出
		while (i >= 0) {
			key = layerIds[i];
			state = updateStateMap[key];
			if (state === UpdateState.DELETE) {
				renderer.removeLayer(i);
				i = (i - 1) | 0;
				continue;
			}
			result.push(key);
			i = (i - 1) | 0;
		}
		result.reverse();

		// 追加を実行
		let keys = Object.keys(updateStateMap);
		i = 0 | 0;

		while (i < keys.length) {
			key = keys[i];
			state = updateStateMap[key];
			i = (i + 1) | 0;
			if (state !== UpdateState.ADD) {
				continue;
			}
			renderer.addLayer();
			result.push(key);
		}
		return result;
	}
}