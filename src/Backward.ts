import DrawchatRenderer = drawchat.renderer.DrawchatRenderer;
import NamedLayer = drawchat.viewer.NamedLayer;
import LayerMap = drawchat.viewer.LayerMap;
import DrawMoment = drawchat.core.DrawMoment;

import {MapMomentUtil} from "./MapMomentUtil";
import {CheckStateUtils} from "./CheckStateUtils";
import {UpdateState, UpdateStateMap} from "./UpdateState";
export class Backward{

	static updateView(
		renderer:DrawchatRenderer,
		sequencesNow:string[],
		sequencesPrev:string[],
		pastMoments:DrawMoment[],
		futureMoments:DrawMoment[]
	):string[]{

		let pastLayers = MapMomentUtil.mapToMomentsArray(pastMoments,sequencesPrev);
		let layers = MapMomentUtil.mapToMomentsArray(futureMoments,sequencesPrev);
		let updateStateMap = CheckStateUtils.checkState(
			sequencesNow,
			layers
		);
		// console.log(`backward state:${JSON.stringify(updateStateMap)}`);

		//レイヤーの補完
		Backward.complementLayer(renderer,sequencesNow,updateStateMap);

		//表示順の変更
		renderer.sortLayer(CheckStateUtils.createSortOrder(sequencesNow,sequencesPrev));

		//更新の反映
		let i = 0 | 0;
		let layer:NamedLayer;
		let state:UpdateState;

		while(i < pastLayers.length){
			layer = pastLayers[i];
			i = (i + 1) | 0;

			state = updateStateMap[layer.layerId];
			if(state === UpdateState.ADD || state === UpdateState.NON){
				continue;
			}

			renderer.render(i-1,layer.draws,layer.transform,layer.clip);
		}
		return sequencesPrev;
	}

	static complementLayer(
		renderer:DrawchatRenderer,
		layerIds:string[],
		updateStateMap:UpdateStateMap
	):string[]{

		let i = (layerIds.length - 1) | 0;
		let state:UpdateState;
		let key:string;
		let result:string[] = [];

		//	削除を抽出
		while( i >= 0){
			key = layerIds[i];
			state = updateStateMap[key];
			if(state === UpdateState.ADD){
				renderer.removeLayer(i);
				i = (i - 1) | 0;
				continue;
			}
			result.push(key);
			i = (i - 1) | 0;
		}
		result.reverse();

		//	追加を実行
		let keys = Object.keys(updateStateMap);
		i = 0 | 0;

		while( i  < keys.length){
			key = layerIds[i];
			state = updateStateMap[key];
			i = (i + 1) | 0;
			if(state !== UpdateState.DELETE){
				continue;
			}
			renderer.addLayer();
			result.push(key);
		}
		return result;
	}
}