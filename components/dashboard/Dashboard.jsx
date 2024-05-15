/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { fetchSpotifyApi } from '../../api/spotifyAPIDemo';

const Dashboard = () => {
  const types = [
    'album',
    'artist',
    'playlist',
    'track',
    'show',
    'episode',
    'audiobook',
  ];

  const [form, setForm] = useState({
    search: '',
    artist: '',
  });

  const [results, setResults] = useState([]);

  const [typeSelected, setTypeSelected] = useState('');

  const handleSearch = async () => {
    const params = new URLSearchParams();

    params.append(
      'q',
      encodeURIComponent(`remaster track:${form.search} artist:${form.artist}`)
    );
    params.append('type', typeSelected);

    const queryString = params.toString();
    const url = 'https://api.spotify.com/v1/search';

    const updateUrl = `${url}?${queryString}`;
    const token = `Bearer ${localStorage.getItem('token')}`;

    const response = await fetchSpotifyApi(
      updateUrl,
      'GET',
      null,
      'application/json',
      token
    );
    console.log(response);
    setResults(response.tracks.items);
  };

  const handlePlayMusic = async (song) => {
  
    const token = `Bearer ${localStorage.getItem('token')}`;
    const data = {
      uris: [song],
    };
    const id_device = '5690acf0486ee0a38b4bff636e04030a7697463f';
    const playSong = await fetchSpotifyApi(
      `https://api.spotify.com/v1/me/player/play?device_id=${id_device}`,
      'PUT',
      JSON.stringify(data),
      'application/json',
      token
    );
    console.log(playSong);
  };

  const getDeviceId = async () => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const response = await fetchSpotifyApi(
      `https://api.spotify.com/v1/me/player/devices`,
      'GET',
      null,
      'application/json',
      token
    );
    console.log(response);
    return response.devices.id;
  };

  const handleChange = (e) => {
    const newValues = {
      ...form,
      [e.target.name]: e.target.value,
    };
    console.log(newValues);
    setForm(newValues);
  };

  const handleSelectChange = (e) => {
    console.log(e.target.value);
    setTypeSelected(e.target.value);
  };

  const handleGetToken = async () => {
    // stored in the previous step
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    let codeVerifier = localStorage.getItem('code_verifier');
    console.log({ codeVerifier });
    const url = 'https://accounts.spotify.com/api/token';
    const clientId = '467fd8c0038a4d71a73de848210c5746';
    const redirectUri = 'http://localhost:5173/';
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem('token', response.access_token);
  };

  return (
    <div className="bg-gradient-to-t from-[#030303] to-[#282828] h-dvh w-screen flex items-center justify-center flex-col">
      <div>
        <h1 className="text-white text-left text-[30px]">Dashboard</h1>
      </div>
      <div className="flex">
        <div className="text-white text-left text-[15px] p-5">
          <button className='bg-[#1BD760] w-[120px] h-[40px] rounded-[5%]' onClick={handleGetToken}>GET TOKEN</button>
        </div>
        <div className="text-white text-left text-[15px] p-5">
          <button className='bg-[#1BD760] w-[120px] h-[40px] rounded-[5%]'   onClick={getDeviceId}>GET DEVICE ID</button>
        </div>
      </div>
      <div className="flex justify-between w-[60%] align-middle items-center pb-10">
        <div>
          <p className="text-white text-left text-[15px]">Track</p>
          <input
            className="rounded-[2px] h-5 w-[160px] text-white bg-[#121212] border-[#727272] border-solid border-[1px] hover:ring-1 focus:ring-1  ring-white"
            placeholder="search"
            type="text"
            name="search"
            value={form.search}
            onChange={handleChange}
          />
        </div>
        <div>
          <p className="text-white text-left text-[15px]">Types</p>
          <select
            className="rounded-[2px] h-5 w-[160px] text-white bg-[#121212] border-[#727272] border-solid border-[1px] hover:ring-1 focus:ring-1  ring-white"
            name="types"
            onChange={handleSelectChange}
          >
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-white text-left text-[15px]">Artist</p>

          <input
            className="rounded-[2px] h-5 w-[160px] text-white bg-[#121212] border-[#727272] border-solid border-[1px] hover:ring-1 focus:ring-1  ring-white"
            placeholder="Artist"
            type="text"
            name="artist"
            value={form.artist}
            onChange={handleChange}
          />
        </div>
        <div className="pt-[3%]">
          <button
            className="bg-[#1BD760] w-[140px] rounded-[5px] text-[15px] p-1 font-bold "
            onClick={handleSearch}
          >
            Buscar
          </button>
        </div>
      </div>
      {results.length > 0 && (
        <div className="h-[80%] overflow-auto">
          {results.map((item, idx) => (
            <div
              key={item.id}
              className="text-white flex justify-evenly items-center"
            >
              <div className="w-[30%] p-3 flex items-end">
                <img src={item.album.images[0].url} width={150} />
              </div>
              <div className=" w-[70%] flex">
                <div className="w-1/2 ">
                  <p className="text-[20px]"> {idx + 1 + ' ' + item.name}</p>
                  <p className="text-[15px]">{`${item.artists[0].name}`}</p>
                </div>
                <div className="w-1/2">
                  <button
                    className="bg-[#1BD760] w-[40px] h-[40px] rounded-[100%] text-[15px] p-1 font-bold "
                    onClick={() => handlePlayMusic(item.uri)}
                  >
                    R
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
