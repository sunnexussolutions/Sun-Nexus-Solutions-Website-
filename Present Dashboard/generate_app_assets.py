import os
from PIL import Image, ImageDraw

def generate():
    original_path = 'app_logo_original.png'
    if not os.path.exists(original_path):
        print("Error: app_logo_original.png not found")
        return

    img = Image.open(original_path).convert('RGBA')
    
    # Threshold alpha to get precise logo bounding box
    alpha = img.split()[-1]
    thresh = alpha.point(lambda p: 255 if p > 15 else 0)
    bbox = thresh.getbbox()
    print("Logo bbox:", bbox)
    
    # Add minor padding around logo mark
    pad = 8
    crop_box = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(img.width, bbox[2] + pad),
        min(img.height, bbox[3] + pad)
    )
    logo_mark = img.crop(crop_box)
    print("Logo mark size:", logo_mark.size)

    res_dir = os.path.join('android', 'app', 'src', 'main', 'res')
    
    # 1. Launcher icons & Adaptive foregrounds
    icon_densities = {
        'mipmap-mdpi': (48, 108),
        'mipmap-hdpi': (72, 162),
        'mipmap-xhdpi': (96, 216),
        'mipmap-xxhdpi': (144, 324),
        'mipmap-xxxhdpi': (192, 432),
    }

    for folder, (icon_size, fore_size) in icon_densities.items():
        folder_path = os.path.join(res_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # A) Standard ic_launcher.png (White background + centered logo)
        launcher = Image.new('RGBA', (icon_size, icon_size), (255, 255, 255, 255))
        # Logo target size: ~72% of icon size
        target_size = int(icon_size * 0.72)
        logo_resized = logo_mark.copy()
        logo_resized.thumbnail((target_size, target_size), Image.Resampling.LANCZOS)
        offset = ((icon_size - logo_resized.width) // 2, (icon_size - logo_resized.height) // 2)
        launcher.paste(logo_resized, offset, logo_resized)
        launcher.save(os.path.join(folder_path, 'ic_launcher.png'), 'PNG')
        
        # B) Round ic_launcher_round.png (Circular white canvas + centered logo)
        round_icon = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
        mask = Image.new('L', (icon_size, icon_size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, icon_size, icon_size), fill=255)
        
        bg_white = Image.new('RGBA', (icon_size, icon_size), (255, 255, 255, 255))
        bg_white.paste(logo_resized, offset, logo_resized)
        round_icon.paste(bg_white, (0, 0), mask)
        round_icon.save(os.path.join(folder_path, 'ic_launcher_round.png'), 'PNG')
        
        # C) Adaptive ic_launcher_foreground.png (Transparent canvas + logo in safe 62% area)
        foreground = Image.new('RGBA', (fore_size, fore_size), (0, 0, 0, 0))
        fore_target = int(fore_size * 0.60)
        logo_fore = logo_mark.copy()
        logo_fore.thumbnail((fore_target, fore_target), Image.Resampling.LANCZOS)
        fore_offset = ((fore_size - logo_fore.width) // 2, (fore_size - logo_fore.height) // 2)
        foreground.paste(logo_fore, fore_offset, logo_fore)
        foreground.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), 'PNG')

    # Remove vector XML in drawable-v24 if present so PNG bitmap is used smoothly
    v24_fore = os.path.join(res_dir, 'drawable-v24', 'ic_launcher_foreground.xml')
    if os.path.exists(v24_fore):
        os.remove(v24_fore)
        print("Removed legacy vector XML ic_launcher_foreground.xml")

    # 2. Splash screen drawables (Portrait & Landscape)
    port_densities = {
        'drawable': (512, 512),
        'drawable-port-mdpi': (320, 480),
        'drawable-port-hdpi': (480, 800),
        'drawable-port-xhdpi': (720, 1280),
        'drawable-port-xxhdpi': (960, 1600),
        'drawable-port-xxxhdpi': (1280, 1920),
    }

    land_densities = {
        'drawable-land-mdpi': (480, 320),
        'drawable-land-hdpi': (800, 480),
        'drawable-land-xhdpi': (1280, 720),
        'drawable-land-xxhdpi': (1600, 960),
        'drawable-land-xxxhdpi': (1920, 1280),
    }

    all_splashes = {**port_densities, **land_densities}

    for folder, (width, height) in all_splashes.items():
        folder_path = os.path.join(res_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        splash = Image.new('RGBA', (width, height), (255, 255, 255, 255))
        # Logo centered: max 45% of min dimension
        max_logo_dim = int(min(width, height) * 0.45)
        logo_splash = logo_mark.copy()
        logo_splash.thumbnail((max_logo_dim, max_logo_dim), Image.Resampling.LANCZOS)
        
        offset = ((width - logo_splash.width) // 2, (height - logo_splash.height) // 2)
        splash.paste(logo_splash, offset, logo_splash)
        splash.save(os.path.join(folder_path, 'splash.png'), 'PNG')

    # Android 12+ SplashScreen API Icon (Fits within 192dp circle mask)
    drawable_dir = os.path.join(res_dir, 'drawable')
    os.makedirs(drawable_dir, exist_ok=True)
    splash_icon = Image.new('RGBA', (576, 576), (0, 0, 0, 0))
    target_sp = int(576 * 0.55)
    logo_sp = logo_mark.copy()
    logo_sp.thumbnail((target_sp, target_sp), Image.Resampling.LANCZOS)
    sp_off = ((576 - logo_sp.width) // 2, (576 - logo_sp.height) // 2)
    splash_icon.paste(logo_sp, sp_off, logo_sp)
    splash_icon.save(os.path.join(drawable_dir, 'ic_splash_icon.png'), 'PNG')

    # 3. Web Favicons in public/
    public_dir = 'public'
    os.makedirs(public_dir, exist_ok=True)
    
    fav_32 = Image.new('RGBA', (32, 32), (255, 255, 255, 255))
    logo_32 = logo_mark.copy()
    logo_32.thumbnail((26, 26), Image.Resampling.LANCZOS)
    fav_32.paste(logo_32, ((32 - logo_32.width) // 2, (32 - logo_32.height) // 2), logo_32)
    fav_32.save(os.path.join(public_dir, 'favicon.png'), 'PNG')
    fav_32.save(os.path.join(public_dir, 'favicon.ico'), 'ICO')
    
    fav_512 = Image.new('RGBA', (512, 512), (255, 255, 255, 255))
    logo_512 = logo_mark.copy()
    logo_512.thumbnail((380, 380), Image.Resampling.LANCZOS)
    fav_512.paste(logo_512, ((512 - logo_512.width) // 2, (512 - logo_512.height) // 2), logo_512)
    fav_512.save(os.path.join(public_dir, 'logo.png'), 'PNG')

    # Save tight-cropped logo mark for UI components
    logo_mark.save(os.path.join(public_dir, 'logo_mark.png'), 'PNG')

    print("Successfully generated all Android & Web logo assets!")

if __name__ == '__main__':
    generate()
