import {structures} from "@s2study/draw-api";
import Layer = structures.Layer;
import {DrawAPIUtils} from "@s2study/draw-api/lib/DrawAPIUtils";
import {TRANSFORM_DEFAULT} from "@s2study/draw-api/lib/structures/Transform";

export class NamedLayer implements Layer {

	readonly transform: structures.Transform;
	readonly clip: structures.Clip | null;
	readonly draws: structures.Draw[];
	readonly layerId: string | null;

	constructor(
		layerId: string | null,
		draws: structures.Draw[],
		transform: structures.Transform,
		clip: structures.Clip | null
	) {
		this.layerId = layerId;
		this.draws = draws;
		this.clip = clip;
		this.transform = transform;
	}
	toJSON(): any {
		const json: any = {};
		if (!this.transform.isDefault) {
			json.transform = this.transform.toJSON();
		}
		if (this.draws.length !== 0) {
			const draws: any[] = [];
			for (let draw of this.draws) {
				draws.push(draw.toJSON());
			}
			json.draws = draws;
		}
		if (this.clip !== null) {
			json.clip = this.clip.toJSON();
		}
		return json;
	}
}

export class NamedLayerFactoryStatic {
	createInstance(
		layerId?: string | null,
		draws?: structures.Draw[] | null,
		transform?: structures.Transform | null,
		clip?: structures.Clip | null
	): NamedLayer {
		return new NamedLayer(
			DrawAPIUtils.complement(layerId, null),
			DrawAPIUtils.complement(draws, []),
			DrawAPIUtils.complement(transform, TRANSFORM_DEFAULT),
			DrawAPIUtils.complement(clip, null)
		);
	}
}
export interface LayerMap {
	[key: string]: NamedLayer;
}
export const NamedLayerFactory: NamedLayerFactoryStatic = new NamedLayerFactoryStatic();
export default NamedLayerFactory;