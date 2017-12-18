export class Message {

	constructor(

		public _id:string,
		public text:string,
		public created_at:string,
		public emitter_id:string,
		public receiver_id:string

	){}
}

