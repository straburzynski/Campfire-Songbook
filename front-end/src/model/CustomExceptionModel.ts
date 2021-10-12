export interface CustomExceptionModel {
    message: string;
    translationKey: string;
    params: Map<string, object>;
}
