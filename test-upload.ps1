# Test Google Drive file upload
Write-Host "🚀 Testing Google Drive File Upload..." -ForegroundColor Green

# Create test file content
$testContent = @"
This is a test file for Google Drive upload!
Created at: $(Get-Date)
Testing Google Drive API integration.

Features:
- File upload to Google Drive
- Simulation mode for development  
- Fallback to local storage
- Public sharing links
- File management

This file will be uploaded to Google Drive (simulation mode).
"@

# Write test file
$testContent | Out-File -FilePath "test-upload-file.txt" -Encoding UTF8

Write-Host "📁 Created test file: test-upload-file.txt" -ForegroundColor Yellow

# Test the upload using Invoke-RestMethod
try {
    $uri = "http://localhost:8080/api/v1/files/upload"
    
    # Read file as bytes
    $fileBytes = [System.IO.File]::ReadAllBytes("test-upload-file.txt")
    $fileName = "test-upload-file.txt"
    
    # Create multipart form data
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: text/plain$LF",
        [System.Text.Encoding]::UTF8.GetString($fileBytes),
        "--$boundary",
        "Content-Disposition: form-data; name=`"userId`"$LF",
        "test-user-123",
        "--$boundary",
        "Content-Disposition: form-data; name=`"folderId`"$LF", 
        "root",
        "--$boundary--$LF"
    ) -join $LF
    
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $bodyLines -ContentType "multipart/form-data; boundary=$boundary"
    
    Write-Host "✅ Upload successful!" -ForegroundColor Green
    Write-Host "📄 Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3 | Write-Host
    
} catch {
    Write-Host "❌ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "📄 Error details: $($_.Exception)" -ForegroundColor Yellow
}

Write-Host "`n🔍 Check backend logs for Google Drive simulation messages!" -ForegroundColor Magenta