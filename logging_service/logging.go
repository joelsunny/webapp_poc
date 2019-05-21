package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// Log type definition
type Log struct {
	Pid string `json: pid`
	Log string `json: executionLog`
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/log", Logger)
	mux.HandleFunc("/log/get", ReturnLog)
	http.ListenAndServe(":8082", mux)
}

// Monitor service
func Logger(w http.ResponseWriter, r *http.Request) {
	// endpoint listening for status from target, returns the current status of task in json

	decoder := json.NewDecoder(r.Body)
	var s Log
	err := decoder.Decode(&s)
	if err != nil {
		panic(err)
	}
	// update status in a persistent storage, for now filesystem
	updateJson(&s)
	fmt.Fprintf(w, "INFO: Logger function invoked")

}

func updateJson(s *Log) {
	file, err := json.MarshalIndent(s, "", " ")
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile("log.json", file, 0644)
}

func ReturnLog(w http.ResponseWriter, r *http.Request) {
	var s *Log
	file, err := ioutil.ReadFile("log.json")
	err = json.Unmarshal(file, &s)

	responseJSON, err := json.Marshal(s)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(responseJSON)

}
