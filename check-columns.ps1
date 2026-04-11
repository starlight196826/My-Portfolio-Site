$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycGN0ZGJrb3JhcXJhZXBoeW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjU5NTMsImV4cCI6MjA5MTIwMTk1M30.WPjf3bFBaJtvRDOSKvS4EEJfFqdDK_9dkG2edX0tj7I'
$base = 'https://crpctdbkoraqraephymb.supabase.co/rest/v1'
$headers = @{ 'apikey' = $key; 'Authorization' = "Bearer $key"; 'Accept' = 'application/json' }

foreach ($t in @('work_experience','projects','articles','profile')) {
    $r = Invoke-WebRequest -Uri "$base/${t}?limit=1" -Headers $headers -ErrorAction SilentlyContinue
    Write-Host "=== $t ==="
    if ($r) { $r.Content } else { "FAILED" }
    Write-Host ""
}
