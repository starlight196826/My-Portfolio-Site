const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycGN0ZGJrb3JhcXJhZXBoeW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjU5NTMsImV4cCI6MjA5MTIwMTk1M30.WPjf3bFBaJtvRDOSKvS4EEJfFqdDK_9dkG2edX0tj7I';
const BASE = 'https://crpctdbkoraqraephymb.supabase.co/rest/v1';
const HEADERS = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` };

const TABLES = {
  work_experience: ['id','company','role','start_date','startDate','end_date','endDate','description','technologies','current','is_current'],
  projects:        ['id','title','description','excerpt','tags','category','live_url','liveUrl','github_url','githubUrl','image','image_url','featured'],
  articles:        ['id','slug','title','excerpt','category','tags','published_at','publishedAt','read_time','readTime','cover_image','coverImage','cover_image_url','content'],
  profile:         ['id','name','full_name','title','role','bio','email','location','profile_image','profileImage','photo','years_of_experience','yearsOfExperience','projects_completed','projectsCompleted','companies_worked','companiesWorked','technologies_learned','technologiesLearned'],
};

for (const [table, cols] of Object.entries(TABLES)) {
  console.log(`\n=== ${table} ===`);
  for (const col of cols) {
    const res = await fetch(`${BASE}/${table}?select=${col}&limit=0`, { headers: HEADERS });
    if (res.ok) {
      console.log(`  ✓ ${col}`);
    } else {
      const json = await res.json();
      console.log(`  ✗ ${col}  →  ${json.message}`);
    }
  }
}
