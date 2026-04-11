$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycGN0ZGJrb3JhcXJhZXBoeW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjU5NTMsImV4cCI6MjA5MTIwMTk1M30.WPjf3bFBaJtvRDOSKvS4EEJfFqdDK_9dkG2edX0tj7I'
$base = 'https://crpctdbkoraqraephymb.supabase.co/rest/v1'
$headers = @{ 'apikey' = $key; 'Authorization' = "Bearer $key" }

$tables = @{
    'work_experience' = @('id','company','role','start_date','startDate','end_date','endDate','description','technologies','current','is_current')
    'projects'        = @('id','title','description','excerpt','tags','category','live_url','liveUrl','github_url','githubUrl','image','image_url','featured')
    'articles'        = @('id','slug','title','excerpt','category','tags','published_at','publishedAt','read_time','readTime','cover_image','coverImage','cover_image_url','content')
    'profile'         = @('id','name','full_name','title','role','bio','email','location','profile_image','profileImage','photo','avatar','years_of_experience','yearsOfExperience','projects_completed','projectsCompleted','companies_worked','companiesWorked','technologies_learned','technologiesLearned')
}

foreach ($table in $tables.Keys) {
    Write-Host "=== $table ===" -ForegroundColor Cyan
    foreach ($col in $tables[$table]) {
        try {
            $r = Invoke-WebRequest -Uri "$base/${table}?select=$col&limit=0" -Headers $headers -UseBasicParsing
            Write-Host "  OK: $col" -ForegroundColor Green
        } catch {
            $body = $_.ErrorDetails.Message
            if ($body -match '"message"') {
                $msg = ($body | ConvertFrom-Json).message
                Write-Host "  NO: $col — $msg" -ForegroundColor Red
            } else {
                Write-Host "  NO: $col" -ForegroundColor Red
            }
        }
    }
    Write-Host ""
}
