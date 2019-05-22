package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// Payload type definition
type Payload struct {
	Cmd          string
	Target       string
	ReverseProxy string
}

// Target type definition
type Target struct {
	Name string `json: name`
	IP   string `json: ip`
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/invoke", Invoke)
	http.ListenAndServe(":8080", mux)
}

// Invoke function
func Invoke(w http.ResponseWriter, r *http.Request) {
	// function to invoke remote procedure on target node
	decoder := json.NewDecoder(r.Body)

	var t Payload
	err := decoder.Decode(&t)

	if err != nil {
		panic(err)
	}

	go runCmd(&t)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, "INFO: Completed")

}

func runCmd(t *Payload) {

	targetIP := discoverTarget(t.Target)
	url := "http://" + targetIP + ":5001/agent"
	fmt.Println(url)
	payloadJSON, err := json.Marshal(t)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadJSON))
	if err != nil {
		panic(err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	resp.Body.Close()
}

func discoverTarget(target string) string {

	var s *Target
	file, err := ioutil.ReadFile("targets.json")
	err = json.Unmarshal(file, &s)
	if err != nil {
		panic(err)
	}
	ip := s.IP
	fmt.Println(ip)
	return (ip)

}
