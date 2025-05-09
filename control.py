from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import os
import json
import matplotlib.pyplot as plt
import io
import numpy as np #Datos numericos

app = Flask(__name__)
CORS(app)


NOMBRE_ARCHIVO_OPINIONES = "opiniones_energia.json" #Archivo creado

if not os.path.exists(NOMBRE_ARCHIVO_OPINIONES):
    with open(NOMBRE_ARCHIVO_OPINIONES, "w") as f:
        json.dump([], f, indent=4)


def leer_opiniones():
    """Lee los datos del archivo JSON de opiniones."""
    try:
        with open(NOMBRE_ARCHIVO_OPINIONES, "r", encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Si el archivo no existe o está vacío retorna lista vacía
        return []

def guardar_opiniones(opiniones):
    """Guarda los datos en el archivo JSON de opiniones."""
    with open(NOMBRE_ARCHIVO_OPINIONES, "w", encoding='utf-8') as f:
        json.dump(opiniones, f, indent=4, ensure_ascii=False) # El ensure_ascii=False  guarda los caracteres especiales

# --- Endpoints(dirección a la que se le hace la solicitud) para el api ---

@app.route('/guardar_opinion', methods=["POST"])
def guardar_opinion():
    """Recibe y guarda una nueva opinión en el archivo JSON."""
    try:
        nueva_opinion = request.json
        if not nueva_opinion:
            return jsonify({"mensaje": "Error: No se recibieron datos JSON"}), 400

        opiniones = leer_opiniones()
        opiniones.append(nueva_opinion)
        guardar_opiniones(opiniones)

        return jsonify({"mensaje": "ok"}) # Retorna el JSON

    except Exception as e:
        print(f"Error al guardar opinión: {e}")
        return jsonify({"mensaje": "Error interno del servidor"}), 500 #Si hay error


@app.route('/consultar_opiniones', methods=["GET"]) # Get solicita y post envia
def consultar_opiniones():
    """Retorna todos los datos de opiniones guardados."""
    try:
        opiniones = leer_opiniones()
        return jsonify(opiniones) # Retornar la lista de opiniones

    except Exception as e:
        print(f"Error al consultar opiniones: {e}")
        return jsonify({"mensaje": "Error interno del servidor"}), 500


@app.route('/grafica_consumo')
def grafica_consumo():
    """Genera y retorna un histograma del consumo eléctrico."""
    try:
        opiniones = leer_opiniones()

        # Extraer consumos eléctricos válidos
        consumos = [
            opinion.get('consumoElectricoKwh') for opinion in opiniones
            if isinstance(opinion.get('consumoElectricoKwh'), (int, float)) # Valida  que sea número real
        ]

        if not consumos:
            # Si no hay datos de consumo, indica que no hay datos
            fig, ax = plt.subplots()
            ax.text(0.5, 0.5, 'No hay datos de consumo disponibles',
                    horizontalalignment='center',
                    verticalalignment='center',
                    transform=ax.transAxes,
                    fontsize=12, color='gray')
            ax.axis('off') # Ocultar ejes
            img = io.BytesIO()
            plt.savefig(img, format='png')
            plt.close()
            img.seek(0)
            return Response(img.getvalue(), mimetype='image/png')

        # Generar el histograma
        plt.figure(figsize=(8, 6)) # Ajustar tamaño 
       
        plt.hist(consumos, bins=30, color='green', edgecolor='navy') # 30 barras y el color
        plt.title('Consumo energético') # Título
        plt.xlabel('Consumo eléctrico (kWh)') # Eje X: rangos de consumo
        plt.ylabel(' Numero de personas  con igual consumo ') # Eje Y: cantidades

        # Guardar el gráfico temporalmente
        img = io.BytesIO()
        plt.savefig(img, format='png')
        plt.close() # Cierra la figura.
        img.seek(0) # Mueve el puntero

        # Retorna la imagen PNG
        return Response(img.getvalue(), mimetype='image/png')

    except Exception as e:
        print(f"Error al generar gráfica: {e}")
         # En caso de error retornar un mensaje de error 
        fig, ax = plt.subplots()
        ax.text(0.5, 0.5, f'Error al generar gráfico: {e}',
                horizontalalignment='center',
                verticalalignment='center',
                transform=ax.transAxes,
                fontsize=10, color='red', wrap=True)
        ax.axis('off')
        img = io.BytesIO()
        plt.savefig(img, format='png')
        plt.close()
        img.seek(0)
        return Response(img.getvalue(), mimetype='image/png')


if __name__ == "__main__":
    app.run(debug=True, port=5000) 