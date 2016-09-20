import DrawchatViewer = drawchat.viewer.DrawchatViewer;
import DrawchatRenderer = drawchat.renderer.DrawchatRenderer;
import DrawHistory = drawchat.core.DrawHistory;
import DrawMoment = drawchat.core.DrawMoment;
import DrawLayerMoment = drawchat.core.DrawLayerMoment;
import Layer = drawchat.Layer;
import NamedLayer = drawchat.viewer.NamedLayer;
import {Backward} from "./Backward";
import {Forward} from "./Forward";
export class Viewer implements DrawchatViewer{

	private history:DrawHistory;
	private renderer:DrawchatRenderer;
	private sequencesNow:string[] = null;
	private now:number;

	constructor(
		history:DrawHistory,
		renderer:DrawchatRenderer
	){
		this.history = history;
		this.renderer = renderer;
		this.now = -1;
	}

	private _active:boolean = false;
	private _waiting:boolean = false;

	clear():void {
		this.now = -1;
		this.sequencesNow = [];
		this.renderer.clear();
	}

	createImageDataURI():string {
		return this.renderer.createImageDataURI();
	}

	show(target?:number[]):void {
		this.show(target);
	}

	hide(target?:number[]):void {
		this.hide(target);
	}

	start():void{
		this._active = true;
		if(this._waiting){
			return;
		}
		this._waiting= true;
		try {
			this.updateView();
			// this.renderer.refresh();
		} catch (e) {
			console.warn(e);
		}
		this.history.awaitUpdate(()=>{
			this._waiting = false;
			if(this._active){
				this.start();
			}
		});
	}

	stop():void{
		this._active = false;
	}

	getPixelColor(
		x: number,
		y: number,
		layerIndex:number
	): number[] {
		return this.renderer.getPixelColor(x,y,layerIndex);
	}

	refresh(): void {
		this.now = -1;
		this.updateView();
	}

	updateView():void{

		let number = this.history.getNowHistoryNumber();
		if(this.now === number){
			return;
		}
		if(!this.history.isAvailable(this.now)){
			this.now = -1;
			this.sequencesNow = [];
			this.renderer.clear();
		}

		//過去へ戻る（Undoなど）
		if(this.now > number){
			this.sequencesNow = Backward.updateView(
				this.renderer,
				this.sequencesNow,
				this.history.getLayers(number),
				this.history.getMoments(-1,number),
				this.history.getMoments(number + 1,this.now)
			);
			this.now = number;
			return;
		}

		//進む
		this.sequencesNow = Forward.updateView(
			this.renderer,
			this.sequencesNow,
			this.history.getLayers(number),
			this.history.getMoments(-1,this.now),
			this.history.getMoments(this.now + 1,number)
		);
		this.now = number;
	}
}
export default Viewer;
