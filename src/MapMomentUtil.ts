import DrawMoment = drawchat.core.DrawMoment;
import Layer = drawchat.Layer;
import NamedLayer = drawchat.viewer.NamedLayer;
import LayerMap = drawchat.viewer.LayerMap;

import DrawLayerMoment = drawchat.core.DrawLayerMoment;

export class MapMomentUtil{

	/**
	 * 編集履歴をlayer毎に区分けして表示順にまとめる。
	 * @param moments
	 * @param sequences
	 * @returns {Array}
	 */
	static mapToMomentsArray(
		moments:DrawMoment[],
		sequences:string[]
	):NamedLayer[]{
		let layerMap = MapMomentUtil.mapMoments(moments,sequences);
		let result:NamedLayer[] = [];
		for(let layerId of sequences){
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
		moments:DrawMoment[],
		sequences:string[]
	):LayerMap{
		return MapMomentUtil.mapMoments(moments,sequences);
	}

	/**
	 * 2つのLayerを1つめのレイヤーに結合する。
	 * @param layer1
	 * @param layer2
	 */
	static concatLayer(
		layer1:NamedLayer = {layerId:null,draws:[]},
		layer2:NamedLayer = {layerId:null,draws:[]}
	):NamedLayer{
		if(layer2.clip){
			layer1.clip = layer2.clip;
		}
		if(layer2.transform){
			layer1.transform = layer2.transform;
		}

		let i = 0 | 0;
		while(i < layer2.draws.length){
			layer1.draws.push(layer2.draws[i]);
			i = (i + 1) | 0;
		}
		if(layer1.layerId == null){
			layer1.layerId = layer2.layerId;
		}
		return layer1;
	}

	/**
	 * 編集履歴をlayer毎に区分けして表示順にまとめる。
	 * @param moments
	 * @param sequences
	 * @returns {Array}
	 */
	private static mapMoments(
		moments:DrawMoment[],
		sequences:string[]
	):LayerMap{
		let layerMap:LayerMap = {};
		if(sequences == null){
			return layerMap;
		}
		for(let layerId of sequences){
			layerMap[layerId] = {layerId:layerId,draws:[]};
		}
		if(moments == null){
			return layerMap;
		}
		for(let moment of moments){
			MapMomentUtil.mapMoment(layerMap,moment);
		}
		return layerMap;
	}

	/**
	 * LayerId毎にDraw履歴を再統合する。
	 * @param layerMap
	 * @param moment
	 */
	static mapMoment(layerMap:LayerMap,moment:DrawMoment):void{

		let keys = moment.getKeys();
		let i = 0 | 0;
		let len = keys.length;
		var layerMoment:DrawLayerMoment;
		var layer:NamedLayer;

		while(i < len){
			layerMoment = moment.getLayerMoment(keys[i]);
			layer = layerMap[keys[i]];
			i = (i + 1) | 0;
			if(layer == null){
				continue;
			}
			if(layerMoment.getClip() != null){
				layer.clip = layerMoment.getClip();
			}
			if(layerMoment.getTransform() != null){
				layer.transform = layerMoment.getTransform();
			}
			MapMomentUtil.addDrawsToLayer(layerMoment,layer);
		}
	}

	/**
	 * LayerMomentのDrawを1つのLayerオブジェクトに統合する。
	 * @param layerMoment
	 * @param layer
	 */
	private static  addDrawsToLayer(layerMoment:DrawLayerMoment,layer:Layer){
		let draws = layerMoment.getDraws();
		if(draws == null || draws.length === 0){
			return;
		}

		let i = 0 | 0;
		while(i < draws.length){
			layer.draws.push(draws[i]);
			i = (i + 1) | 0;
		}
	}
}
