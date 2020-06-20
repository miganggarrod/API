declare interface IApiWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'ApiWebPartStrings' {
  const strings: IApiWebPartStrings;
  export = strings;
}
