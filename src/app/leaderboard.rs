pub mod leaderboard {
    use postgrest::Postgrest;
    use std::{future::Future, process::Output};

    pub async fn get_leaderboard() -> String {
        let client = Postgrest::new("https://ivfpigydeijkxgwetdef.supabase.co/rest/v1/")
.insert_header("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZnBpZ3lkZWlqa3hnd2V0ZGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkyODI0ODAsImV4cCI6MjAyNDg1ODQ4MH0.QAA-8fEv4ABgicKxVV5047JY9MAaNbzSJWNWBno5sNk"); // EXAMPLE ONLY!
                                                                                                                                                                                                                                              // Don't actually hard code this value, that's really bad. Use environment
                                                                                                                                                                                                                                              // variables like with the dotenv(https://crates.io/crates/dotenv) crate to inject
        let resp = client
            .from("Leaderboard")
            .select("*")
            .order("rank")
            .execute()
            .await
            .ok()
            .unwrap();
        let body = resp.text(); //.await.ok().unwrap();

        body.await.unwrap()
    }
}
