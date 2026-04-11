$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycGN0ZGJrb3JhcXJhZXBoeW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjU5NTMsImV4cCI6MjA5MTIwMTk1M30.WPjf3bFBaJtvRDOSKvS4EEJfFqdDK_9dkG2edX0tj7I'
$base = 'https://crpctdbkoraqraephymb.supabase.co/rest/v1'
$headers = @{ 'apikey' = $key; 'Authorization' = "Bearer $key" }

$tables = @{
    'work_experience' = @('id','company','role','start_date','startDate','end_date','endDate','description','technologies','current','is_current')
    'projects'        = @('id','title','description','excerpt','tags','category','live_url','liveUrl','github_url','githubUrl','image','featured')
    'articles'        = @('id','slug','title','excerpt','category','tags','published_at','publishedAt','read_time','readTime','cover_image','coverImage','content')
    'profile'         = @('id','name','title','bio','email','location','profile_image','profileImage','years_of_experience','yearsOfExperience','projects_completed','companiesWorked','technologies_learned')
}

foreach ($table in $tables.Keys) {
    Write-Host "=== $table ==="
    $valid = @()
    foreach ($col in $tables[$table]) {
        $r = Invoke-WebRequest -Uri "$base/${table}?select=$col&limit=1" -Headers $headers -ErrorAction SilentlyContinue
        if ($r -and $r.StatusCode -eq 200) { $valid += $col }
    }
    Write-Host ($valid -join ', ')
    Write-Host ""
}
