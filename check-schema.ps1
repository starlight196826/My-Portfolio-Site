$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycGN0ZGJrb3JhcXJhZXBoeW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjU5NTMsImV4cCI6MjA5MTIwMTk1M30.WPjf3bFBaJtvRDOSKvS4EEJfFqdDK_9dkG2edX0tj7I'
$headers = @{ 'apikey' = $key; 'Authorization' = "Bearer $key" }
$r = Invoke-WebRequest -Uri 'https://crpctdbkoraqraephymb.supabase.co/rest/v1/' -Headers $headers
$json = $r.Content | ConvertFrom-Json
$defs = $json.definitions
foreach ($table in @('work_experience','projects','articles','profile')) {
    Write-Host "=== $table ==="
    if ($defs.$table) {
        $defs.$table.properties.PSObject.Properties.Name -join ', '
    } else { "not found" }
    Write-Host ""
}
