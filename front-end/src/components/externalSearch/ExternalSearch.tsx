import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SessionModel } from '../../model/SessionModel';
import { InputText } from 'primereact/inputtext';
import { ExternalApiSongModel } from '../../model/ExternalApiSongModel';
import { externalApiSearch, externalApiUpdateSession } from '../../service/ExternalApiSongService';
import { Button } from 'primereact/button';

const ExternalSearch = ({ onSongSelected }) => {
    const appContext = useContext(AppContext);
    const [songs, setSongs] = useState<ExternalApiSongModel[]>([]);
    const [query, setQuery] = useState<string>('');

    const handleSearchButton = async () => {
        externalApiSearch(query).then((res: ExternalApiSongModel[]) => {
            setSongs(res);
        });
    };

    const updateSession = (song: ExternalApiSongModel) => {
        if (song && appContext.host && appContext.sessionName != null)
            externalApiUpdateSession(song, appContext.sessionName).then((res: SessionModel) => {
                appContext.changeSong(res.song);
                onSongSelected();
            });
    };

    return (
      <>
          <div className="p-d-flex p-jc-end p-mb-2 p-mr-2">
              <div className="p-grid p-justify-center">
                  <div className="p-col-12">
                      <div className="p-inputgroup">
                          <InputText
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search"
                          />
                          <Button onClick={handleSearchButton} icon="pi pi-search" className="p-button-secondary" />
                      </div>
                  </div>
              </div>
          </div>
          <div className="card">
              {songs.length > 0 ? (
                <DataTable
                  value={songs}
                  sortField="artist"
                  sortOrder={1}
                  onRowClick={(row) => updateSession(row.data)}
                >
                    <Column field="artist" header="author" sortable />
                    <Column field="title" header="title" sortable />
                </DataTable>
              ) : (
                <p className="p-text-center">No songs found.</p>
              )}
          </div>
      </>
    );
};

export default ExternalSearch;
