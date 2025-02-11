from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import piexif
import cv2
import numpy as np
import textwrap

def modify_metadata(image_path, metadata_key, metadata_value):
    """
    Modifie une métadonnée spécifique d'une image.
    """
    exif_dict = piexif.load(image_path)
    exif_dict['0th'][getattr(piexif, metadata_key)] = metadata_value.encode()
    exif_bytes = piexif.dump(exif_dict)
    piexif.insert(exif_bytes, image_path)
    print(f"Mise à jour des métadonnées : {metadata_key} -> {metadata_value}")


def hide_text_in_image(image_path, text, output_path):
    """
    Cache un texte dans une image en utilisant la stéganographie (LSB - Least Significant Bit).
    """
    image = cv2.imread(image_path)
    binary_text = ''.join(format(ord(c), '08b') for c in text) + '1111111111111110'  # Fin du texte
    data_index = 0
    total_pixels = image.shape[0] * image.shape[1] * 3

    if len(binary_text) > total_pixels:
        raise ValueError("Le texte est trop long pour être caché dans cette image.")

    for row in image:
        for pixel in row:
            for channel in range(3):
                if data_index < len(binary_text):
                    pixel[channel] = (pixel[channel] & ~1) | int(binary_text[data_index])
                    data_index += 1
                else:
                    break
    
    cv2.imwrite(output_path, image)
    print(f"Texte caché dans l'image enregistrée sous {output_path}.")


def extract_text_from_image(image_path):
    """
    Extrait le texte caché dans une image en utilisant la stéganographie (LSB - Least Significant Bit).
    """
    image = cv2.imread(image_path)
    binary_text = ""
    for row in image:
        for pixel in row:
            for channel in range(3):
                binary_text += str(pixel[channel] & 1)
    
    bytes_list = [binary_text[i:i+8] for i in range(0, len(binary_text), 8)]
    extracted_text = ''.join([chr(int(byte, 2)) for byte in bytes_list if int(byte, 2) != 254])
    return extracted_text.strip()

# Exemple d'utilisation
if __name__ == "__main__":
    image_path = input("Entrez le chemin de l'image : ")
    output_path = "image_stegano.png"
    text_to_hide = input("Entrez le texte à cacher : ")
    metadata_key = input("Entrez la clé de la métadonnée à modifier (ex: 'ImageDescription') : ")
    metadata_value = input("Entrez la valeur de la métadonnée : ")
    
    modify_metadata(image_path, metadata_key, metadata_value)
    hide_text_in_image(image_path, text_to_hide, output_path)
    print("Texte extrait :", extract_text_from_image(output_path))
