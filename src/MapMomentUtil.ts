import * as drawchat from "@s2study/draw-api";

import DrawMoment = drawchat.history.DrawMoment;
import Layer = drawchat.structures.Layer;

import DrawLayerMoment = drawchat.history.DrawLayerMoment;
import {LayerMap, NamedLayer, NamedLayerFactory} from "./NamedLayer";
import {DrawAPIUtils} from "@s2study/draw-api/lib/DrawAPIUtils";

const DEFAULT_NAMED_LAYER: NamedLayer = NamedLayerFactory.createInstance();

export class MapMomentUtil {

	/**
	 * 編集履歴をlayer毎に区分けして表示順にまとめる。
	 * @param moments
	 * @param sequences
	 * @returns {Array}
	 */
	static mapToMomentsArray(
		moments: DrawMoment[],
		sequences: string[]
	): NamedLayer[] {
		let layerMap = MapMomentUtil.mapMoments(moments, sequences);
		let result: NamedLayer[] = [];
		for (let layerId of sequences) {
			result.push(layerMap[layerId]);
		}
		return result;
	}

	/**
	 * 編集履歴をlayer毎に区分けして表示順にまとめる。
	 * @param moments
	 * @param sequences
	 * @returns {Array}
	 */
	static mapToLayerMap(
		moments: DrawMoment[],
		sequences: string[]
	): LayerMap {
		return MapMomentUtil.mapMoments(moments, sequences);
	}

	/**
	 * 2つのLayerを1つめのレイヤーに結合する。
	 * @param layer1
	 * @param layer2
	 */
	static concatLayer(
		layer1?: NamedLayer | null,
		layer2?: NamedLayer | null
	): NamedLayer {
		const layer_1: NamedLayer = DrawAPIUtils.complement(layer1, DEFAULT_NAMED_LAYER);
		const layer_2: NamedLayer = DrawAPIUtils.complement(layer2, DEFAULT_NAMED_LAYER);
		return NamedLayerFactory.createInstance(
			DrawAPIUtils.complement(layer_1.layerId, layer_2.layerId),
			layer_1.draws.concat(layer_2.draws),
			layer_2.transform.isDefault === false ? layer_2.transform : layer_1.transform,
			layer_2.clip !== null ? layer_2.clip : layer_1.clip
		);
	}

	/**
	 * 編集履歴をlayer毎に区分けして表示順にまとめる。
	 * @param moments
	 * @param sequences
	 * @returns {Array}
	 */
	private static mapMoments(
		moments: DrawMoment[],
		sequences: string[]
	): LayerMap {
		let layerMap: LayerMap = {};
		if (sequences == null) {
			return layerMap;
		}
		for (let layerId of sequences) {
			layerMap[layerId] = NamedLayerFactory.createInstance(layerId);
		}
		if (moments == null) {
			return layerMap;
		}
		for (let moment of moments) {
			MapMomentUtil.mapMoment(layerMap, moment);
		}
		return layerMap;
	}

	/**
	 * LayerId毎にDraw履歴を再統合する。
	 * @param layerMap
	 * @param moment
	 */
	static mapMoment(layerMap: LayerMap, moment: DrawMoment): void {

		let keys = moment.getKeys();
		let i = 0 | 0;
		let len = keys.length;
		let layerMoment: DrawLayerMoment | null;
		let layer: NamedLayer;

		while (i < len) {

			const key = keys[i];
			i = (i + 1) | 0;

			layerMoment = moment.getLayerMoment(key);
			layer = layerMap[key];
			if (layerMoment === null || layer === undefined) {
				continue;
			}
			layerMap[key] = NamedLayerFactory.createInstance(
				layer.layerId,
				layer.draws.concat(layerMoment.getDraws()),
				layerMoment.getTransform(),
				layerMoment.getClip(),
			);
		}
	}
}
