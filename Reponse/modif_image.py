import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, PngImagePlugin
from stegano import lsb
import piexif
import os

image_path = ""  # Variable globale pour stocker le chemin de l'image

def hide_data(image_path, identifier, secret_message, hide_in_metadata, hide_in_steganography):
    if not os.path.exists(image_path):
        raise FileNotFoundError("Fichier image introuvable.")
    
    img = Image.open(image_path)
    exif_data = img.info.get("exif", b"")
    exif_dict = piexif.load(exif_data) if exif_data else {"0th": {}}
    
    if hide_in_metadata:
        exif_dict["0th"][piexif.ImageIFD.Artist] = identifier.encode("utf-8")
    
    exif_bytes = piexif.dump(exif_dict)
    if hide_in_steganography:
        img = lsb.hide(image_path, secret_message)
    
    output_path = image_path.replace(".png", "_encoded.jpg")
    img.save(output_path, "jpeg", exif=exif_bytes)
    return output_path

def extract_metadata(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError("Fichier image introuvable.")
    img = Image.open(image_path)
    exif_data = img.info.get("exif", b"")
    if not exif_data:
        return "Aucune donnée EXIF trouvée"
    try:
        exif_dict = piexif.load(exif_data)
        identifier = exif_dict["0th"].get(piexif.ImageIFD.Artist, b"No identifier").decode("utf-8")
        return identifier
    except Exception:
        return "Aucune donnée EXIF valide trouvée"

def extract_steganography(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError("Fichier image introuvable.")
    try:
        return lsb.reveal(image_path)
    except Exception:
        return "Aucun message caché trouvé"

def select_image():
    global image_path
    image_path = filedialog.askopenfilename(filetypes=[("Images", "*.png;*.jpg;*.jpeg")])
    if image_path:
        image_path_label.config(text=image_path)

def process_image():
    global image_path
    if not image_path:
        messagebox.showerror("Erreur", "Veuillez sélectionner une image.")
        return
    
    identifier = identifier_entry.get()
    secret_message = password_entry.get()
    hide_in_metadata = metadata_var.get()
    hide_in_steganography = steganography_var.get()
    
    if not identifier and hide_in_metadata:
        messagebox.showerror("Erreur", "Veuillez remplir l'identifiant.")
        return
    
    if not secret_message and hide_in_steganography:
        messagebox.showerror("Erreur", "Veuillez remplir le mot de passe.")
        return
    
    try:
        encoded_image = hide_data(image_path, identifier, secret_message, hide_in_metadata, hide_in_steganography)
        messagebox.showinfo("Succès", f"Fichier généré :\n- {encoded_image}")
    except Exception as e:
        messagebox.showerror("Erreur", f"Une erreur est survenue : {e}")

def reverse_process():
    global image_path
    image_path = filedialog.askopenfilename(filetypes=[("Images", "*.png;*.jpg;*.jpeg")])
    if not image_path:
        messagebox.showerror("Erreur", "Veuillez sélectionner une image.")
        return
    
    try:
        identifier = extract_metadata(image_path) if metadata_var.get() else "Non extrait"
        secret_message = extract_steganography(image_path) if steganography_var.get() else "Non extrait"
        messagebox.showinfo("Résultats", f"Identifiant : {identifier}\nMot de passe caché : {secret_message}")
    except Exception as e:
        messagebox.showerror("Erreur", f"Une erreur est survenue : {e}")

# Interface Tkinter
root = tk.Tk()
root.title("Outil de Stéganographie et Métadonnées")
root.geometry("450x450")

select_image_button = tk.Button(root, text="Sélectionner une image", command=select_image)
select_image_button.pack(pady=5)
image_path_label = tk.Label(root, text="Aucune image sélectionnée", wraplength=400)
image_path_label.pack()

identifier_label = tk.Label(root, text="Identifiant à cacher :")
identifier_label.pack()
identifier_entry = tk.Entry(root, width=40)
identifier_entry.pack()

password_label = tk.Label(root, text="Mot de passe caché dans l'image :")
password_label.pack()
password_entry = tk.Entry(root, width=40)
password_entry.pack()

metadata_var = tk.BooleanVar()
steganography_var = tk.BooleanVar()

metadata_check = tk.Checkbutton(root, text="Cacher dans les métadonnées", variable=metadata_var)
metadata_check.pack()

steganography_check = tk.Checkbutton(root, text="Cacher dans l'image (stéganographie)", variable=steganography_var)
steganography_check.pack()

process_button = tk.Button(root, text="Cacher les informations", command=process_image)
process_button.pack(pady=5)

reverse_button = tk.Button(root, text="Extraire les informations", command=reverse_process)
reverse_button.pack(pady=5)

root.mainloop()
