Add-Type -AssemblyName System.Drawing

$inputPath = Join-Path (Get-Location) "app/icon.jpg"
$appPng = Join-Path (Get-Location) "app/icon.png"
$pubPng = Join-Path (Get-Location) "public/icon.png"
$appIco = Join-Path (Get-Location) "app/favicon.ico"
$pubIco = Join-Path (Get-Location) "public/favicon.ico"

$img = [System.Drawing.Image]::FromFile($inputPath)
$img.Save($appPng, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Save($pubPng, [System.Drawing.Imaging.ImageFormat]::Png)

# Create 64x64 icon
$bitmap = New-Object System.Drawing.Bitmap($img, 64, 64)
$hIcon = $bitmap.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)

$stream1 = [System.IO.File]::OpenWrite($appIco)
$icon.Save($stream1)
$stream1.Close()

$stream2 = [System.IO.File]::OpenWrite($pubIco)
$icon.Save($stream2)
$stream2.Close()

$img.Dispose()
$bitmap.Dispose()

Write-Output "Favicons generated successfully"
