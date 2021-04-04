import * as React from 'react';
// import styles from './Api.module.scss';
import { IApiProps } from './IApiProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton, Stack, IStackTokens, Fabric, Separator, DetailsList, IColumn, Pivot, PivotItem, Label, IStyleSet, ILabelStyles } from 'office-ui-fabric-react';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";

import { Topico } from './Topicos';
import { ITopico } from './ITopicos';
import { Indicador } from './Indicadores';
import { IIndicador } from './IIndicadores';

import { Pais } from './Paises';
import { IPais } from './IPaises';

const opcionesHttp: IHttpClientOptions = {
  // headers: [
  //   ['accept', 'application/json']
  // ],
  mode: 'cors',
};

const estiloscombo: Partial<IDropdownStyles> = {
  dropdown: { width: 100 },
};
const opciones: IDropdownOption[] = [
  { key: 'en', text: 'Ingles' },
  { key: 'es', text: 'Español' },
  { key: 'fr', text: 'Frances' }
];

const stackTokens: IStackTokens = { childrenGap: 40 };
export interface IthirdpartyState {
  Idioma: string;
  Topicos: Topico[];
  Indicadores: Indicador[];
  Paises: Pais[];
  PaginaTopicos: number;
  PaginaIndicadores: number;
  PaginaPaises: number;
  PaginasIndicadores:number;
  PaginasPaises: number;

}
const estilosLabel: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};
export default class Api extends React.Component<IApiProps, IthirdpartyState> {
  private columnasTopicos: IColumn[];
  private columnasIndicadores: IColumn[];
  private columnasPaises: IColumn[];
  constructor(props: IApiProps, state: IthirdpartyState) {
    super(props);
    this.columnasTopicos = [
      { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 20, maxWidth: 20, isResizable: false },
      { key: 'column2', name: 'Valor', fieldName: 'value', minWidth: 100, maxWidth: 100, isResizable: true },
      { key: 'column3', name: 'Nota', fieldName: 'sourceNote', minWidth: 100, maxWidth: 200, isResizable: true },
    ];
    this.columnasIndicadores = [
      { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 100, maxWidth: 100, isResizable: false },
      { key: 'column2', name: 'Nombre', fieldName: 'name', minWidth: 100, maxWidth: 100, isResizable: true },
      { key: 'column3', name: 'Fuente', fieldName: 'sourceNote', minWidth: 100, maxWidth: 200, isResizable: true },
    ];
    this.columnasPaises = [
      { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 50, maxWidth: 50, isResizable: false },
      { key: 'column2', name: 'Nombre', fieldName: 'name', minWidth: 100, maxWidth: 100, isResizable: true },
      { key: 'column3', name: 'Capital', fieldName: 'capitalCity', minWidth: 100, maxWidth: 200, isResizable: true },
    ];
    this.state = {
      Idioma:'es',
      Topicos: [],
      Indicadores: [],
      Paises: [],
      PaginaTopicos: 1,
      PaginaIndicadores: 1,
      PaginaPaises: 1,
      PaginasIndicadores:1,
      PaginasPaises: 1,
    };
  }
  public render(): React.ReactElement<IApiProps> {

    return (
      <Fabric >  <Dropdown
        label="Idioma"
        defaultSelectedKey="es"
        options={opciones}
        styles={estiloscombo}
        onChange={this._alcambiarIdioma}
      />
        <Separator></Separator>

        <Pivot aria-label="Basic Pivot Example">
          <PivotItem
            headerText="Topicos"
          // headerButtonProps={{
          //   'data-order': 1,
          //   'data-title': 'My Files Title',
          // }}
          >
            {/* <Label styles={estilosLabel}>Pivot #1</Label> */}
            <DetailsList
              items={this.state.Topicos}
              columns={this.columnasTopicos}
            />
          </PivotItem>
          <PivotItem headerText="Indicadores">
            {/* <Label styles={estilosLabel}>Pivot #2</Label> */}
            <Pagination currentPage={this.state.PaginaIndicadores}
              totalPages={this.state.PaginasIndicadores}
              onChange={(page) => this._getPageIndicadores(page)}/>
            <DetailsList
              items={this.state.Indicadores}
              columns={this.columnasIndicadores}
            />
          </PivotItem>
          <PivotItem headerText="Paises">
            {/* <Label styles={estilosLabel}>Pivot #3</Label> */}
            <Pagination currentPage={this.state.PaginaPaises}
              totalPages={this.state.PaginasPaises}
              onChange={(page) => this._getPagePaises(page)}/>
            <DetailsList
              items={this.state.Paises}
              columns={this.columnasPaises}
            />

          </PivotItem>
        </Pivot>
      </Fabric>
    );
  }

  private _getPagePaises(page: number) {
    // console.log('Page:', page);
    this.setState({PaginaPaises:page});
    this._CambiarPaises(this.state.Idioma, page);
  }
  private _getPageIndicadores(page: number) {
    // console.log('Page:', page);
    this.setState({PaginaIndicadores:page});
    this._CambiarIndicadores(this.state.Idioma, page);
  }
  // https://jsonplaceholder.typicode.com/photos
  private _getApi(url: string): Promise<any> {
    return this.props.mihttp.get(url,
      HttpClient.configurations.v1, opcionesHttp
    ).then((response: HttpClientResponse) => {
      // console.log('res', response);
      return response.json();
    }).then(jsonResponse => {
      console.log(jsonResponse);
      return jsonResponse;
    }) as Promise<any>;
  }

  public componentDidMount() {
    this._CambiarTopicos('es', 1);
    this._CambiarIndicadores('es', 1);
    this._CambiarPaises('es', 1);
  }

  private _alcambiarIdioma = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    this.setState({Idioma:option.key.toString()});
    this._CambiarTopicos(option.key.toString(), this.state.PaginaTopicos);
    this._CambiarIndicadores(option.key.toString(), this.state.PaginaIndicadores);
    this._CambiarPaises(option.key.toString(), this.state.PaginaPaises);
  }
  private _CambiarTopicos(idioma: string, pagina: number) {
    let topicos: ITopico[] = [];
    this._getApi('https://api.worldbank.org/v2/' + idioma + '/topic?page=' + pagina + '&format=json').then((resultados: any[]) => {
      resultados[1].forEach(resultado => {
        topicos.push({
          id: resultado.id,
          value: resultado.value,
          sourceNote: resultado.sourceNote,
        });

      });
      this.setState({ Topicos: topicos });
    });
  }

  private _CambiarIndicadores(idioma: string, pagina: number) {
    let indicadores: IIndicador[] = [];
    this._getApi('https://api.worldbank.org/v2/' + idioma + '/indicator?page=' + pagina + '&format=json').then((resultados: any[]) => {
      resultados[1].forEach(resultado => {
        indicadores.push({
          id: resultado.id,
          name: resultado.name,
          sourceNote: resultado.sourceNote,
          sourceOrganization: resultado.sourceOrganzation,
        });

      });
      this.setState({ Indicadores: indicadores,PaginasIndicadores:resultados[0].pages});
    });
  }
  private _CambiarPaises(idioma: string, pagina: number) {
    let paises: IPais[] = [];
    this._getApi('https://api.worldbank.org/v2/' + idioma + '/country?page=' + pagina + '&format=json').then((resultados: any[]) => {
      resultados[1].forEach(resultado => {
        paises.push({
          id: resultado.id,
          name: resultado.name,
          capitalCity: resultado.capitalCity
        });

      });
      this.setState({ Paises: paises, PaginasPaises: resultados[0].pages });
    });
  }
}
