import drawchat from "@s2study/draw-api";

import NamedLayer = drawchat.viewer.NamedLayer;
import {UpdateState, UpdateStateMap} from "./UpdateState";

export class CheckStateUtils {

	/**
	 * 変更前後のID順序からRendererに設定するソートオーダーを計算する。
	 * @param beforeLayers
	 * @param afterLayers
	 * @returns {Array}
	 */
	static createSortOrder(
		beforeLayers: string[],
		afterLayers: string[]
	): number[] {

		let map: {[key: string]: number} = {};
		let i = 0 | 0;
		while (i < beforeLayers.length) {
			map[beforeLayers[i]] = i;
			i = (i + 1) | 0;
		}

		i = 0 | 0;
		let result: number[] = [];
		while (i < afterLayers.length) {
			let afterIndex = map[afterLayers[i]];
			result.push(afterIndex != null ? afterIndex : -1);
			i = (i + 1) | 0;
		}
		return result;
	}

	/**
	 * 変更区分を計算する。
	 * @param beforeLayers1
	 * @param afterLayers1
	 * @returns {{}}
	 */
	static checkState(
		beforeLayers1: string[],
		afterLayers1: NamedLayer[]
	): UpdateStateMap {

		let beforeLayers: string[] = beforeLayers1 != null ? beforeLayers1 : [];
		let afterLayers: NamedLayer[] = afterLayers1 != null ? afterLayers1 : [];
		let map: {[key: string]: UpdateState} = {};

		let i = 0 | 0;
		let len = beforeLayers.length;
		while (i < len) {
			map[beforeLayers[i]] = UpdateState.DELETE;
			i = (i + 1) | 0;
		}

		i = 0 | 0;
		len = afterLayers.length;
		let layer: NamedLayer;
		while (i < len) {
			layer = afterLayers[i];
			i = (i + 1) | 0;

			if (map[layer.layerId] == null) {
				map[layer.layerId] = UpdateState.ADD;
				continue;
			}
			if (layer.clip != null || layer.transform != null) {
				map[layer.layerId] = UpdateState.UPDATE_ALL;
				continue;
			}
			if (layer.draws.length > 0) {
				map[layer.layerId] = UpdateState.UPDATE;
				continue;
			}
			map[layer.layerId] = UpdateState.NON;
		}
		return map;
	}
}