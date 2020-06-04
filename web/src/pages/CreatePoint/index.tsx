import React, { useEffect, useState, ChangeEvent } from "react";
import './styles.css'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import logo from '../../assets/logo.svg'
import axios from 'axios';
import api from '../../services/api'


const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [uf, setUf] = useState<string[]>([]);
    const [city, setCity] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })


    interface Item {
        id: number,
        title: string,
        image_url: string,
    }

    interface IBGEUFResponse {
        sigla: string
    }

    interface IBGECityResponse {
        nome: string
    }


    //get nos items 
    useEffect(() => {
        api.get('/items').then(response => (
            setItems(response.data)
        ));
    }, [])

    //get nos estados
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)

            setUf(ufInitials);
        });
    }, [])

    //get nos municipios dos estados
    useEffect(() => {
        if (selectedUf === '0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome)
            setCity(cityNames);
        });
    }, [selectedUf])

    //pega posição atual
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude])
        });
    }, [])

    //trata a seleção do UF
    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    //trata a seleção da cidade baseada no UF
    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    //trata o click no mapa escolhendo a posição
    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

    }


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt='Ecoleta' />

                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp:</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>


                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="uf">Estado (UF):</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf}>
                                <option value='0'>Selecione um estado</option>
                                {uf.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade:</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                            {city.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                                <option value='0'>Selecione uma cidade</option>
                            </select>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítems de Coleta</h2>
                        <span>Selecione um ou mais items abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item =>
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        )}

                    </ul>
                </fieldset>
                <button type='submit'>Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
};

export default CreatePoint