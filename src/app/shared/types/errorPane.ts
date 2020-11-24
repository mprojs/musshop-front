export interface IErrorPane {
  error: any;
  message: string;
  addlMessage: string;
  redirect?: {
    url: string;
    name: string;
  }
}
