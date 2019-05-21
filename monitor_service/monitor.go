package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// Status type definition
type Status struct {
	Pid        string `json: pid`
	CurrStatus string `json: currstatus`
	StartTime  string `json: starttime`
	EndTime    string `json: endtime`
	ExitCode   string `json: exitcode`
	ExitStatus string `json: exitstatus`
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/monitor", Monitor)
	mux.HandleFunc("/monitor/get", ReturnStatus)
	http.ListenAndServe(":8081", mux)
}

// Monitor service
func Monitor(w http.ResponseWriter, r *http.Request) {
	// endpoint listening for status from target, returns the current status of task in json

	decoder := json.NewDecoder(r.Body)
	var s Status
	err := decoder.Decode(&s)
	if err != nil {
		panic(err)
	}
	fmt.Println(s.Pid)
	fmt.Println(s.CurrStatus)
	// update status in a persistent storage, for now filesystem
	updateJson(&s)
	fmt.Fprintf(w, "INFO: Monitor function invoked")

}

func updateJson(s *Status) {
	file, err := json.MarshalIndent(s, "", " ")
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile("status.json", file, 0644)
}

func ReturnStatus(w http.ResponseWriter, r *http.Request) {
	var s *Status
	file, err := ioutil.ReadFile("status.json")
	err = json.Unmarshal(file, &s)

	responseJSON, err := json.Marshal(s)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(responseJSON)

}
