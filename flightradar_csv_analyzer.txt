# Programa en Python para analizar un archivo CSV de Flightradar24
# Requiere: pandas, geopy, pytz, timezonefinder, reverse_geocoder

import pandas as pd
from geopy.distance import geodesic
from datetime import datetime
import pytz
from timezonefinder import TimezoneFinder
import reverse_geocoder as rg


def convertir_timestamp(timestamp):
    return datetime.utcfromtimestamp(timestamp)


def obtener_zona_horaria(lat, lon):
    tf = TimezoneFinder()
    return tf.timezone_at(lat=lat, lng=lon)


def convertir_a_hora_local(dt_utc, lat, lon):
    tz_name = obtener_zona_horaria(lat, lon)
    if tz_name:
        tz = pytz.timezone(tz_name)
        return dt_utc.replace(tzinfo=pytz.utc).astimezone(tz)
    else:
        return dt_utc


def obtener_nombre_ciudad(lat, lon):
    results = rg.search((lat, lon), mode=1)  # mode=1 para mayor rapidez
    return results[0]['name'] + ", " + results[0]['cc']


def analizar_vuelo(csv_path):
    df = pd.read_csv(csv_path)
    df = df.dropna(subset=["Timestamp", "Position"])
    df["Timestamp"] = df["Timestamp"].astype(int)
    df[["Latitude", "Longitude"]] = df["Position"].str.split(",", expand=True).astype(float)

    # Puntos inicial y final
    lat1, lon1 = df.iloc[0]["Latitude"], df.iloc[0]["Longitude"]
    lat2, lon2 = df.iloc[-1]["Latitude"], df.iloc[-1]["Longitude"]

    # Tiempos
    salida_utc = convertir_timestamp(df.iloc[0]["Timestamp"])
    llegada_utc = convertir_timestamp(df.iloc[-1]["Timestamp"])
    hora_salida_local = convertir_a_hora_local(salida_utc, lat1, lon1)
    hora_llegada_local = convertir_a_hora_local(llegada_utc, lat2, lon2)

    # Ciudades
    ciudad_salida = obtener_nombre_ciudad(lat1, lon1)
    ciudad_llegada = obtener_nombre_ciudad(lat2, lon2)

    # Distancias
    millas_nauticas = 0
    for i in range(1, len(df)):
        p1 = (df.iloc[i - 1]["Latitude"], df.iloc[i - 1]["Longitude"])
        p2 = (df.iloc[i]["Latitude"], df.iloc[i]["Longitude"])
        millas_nauticas += geodesic(p1, p2).nautical

    kilometros = millas_nauticas * 1.852
    duracion = llegada_utc - salida_utc

    # Resultado
    print("Aeropuerto de salida (aproximado):", ciudad_salida)
    print("Aeropuerto de llegada (aproximado):", ciudad_llegada)
    print("Hora local de salida:", hora_salida_local.strftime("%Y-%m-%d %H:%M:%S"))
    print("Hora local de llegada:", hora_llegada_local.strftime("%Y-%m-%d %H:%M:%S"))
    print("Tiempo de recorrido:", duracion)
    print("Millas náuticas recorridas:", round(millas_nauticas, 2))
    print("Kilómetros recorridos:", round(kilometros, 2))


# USO: reemplaza 'archivo.csv' con la ruta al archivo descargado de Flightradar24
# analizar_vuelo("3b7410c2.csv")
