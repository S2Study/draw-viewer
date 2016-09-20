export interface UpdateStateMap{
	[key:string]:UpdateState;
}
export enum UpdateState{
	NON,
	UPDATE,
	UPDATE_ALL,
	DELETE,
	ADD
}
