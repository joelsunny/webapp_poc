package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"time"
)

// NOTE: develop an API first instead of focusing on UI

type Payload struct {
	Cmd    string
	Target string
}

type Log struct {
	Pid string `json: pid`
	Log string `json: executionLog`
}

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
	mux.HandleFunc("/invoke", Invoke)
	http.ListenAndServe(":8080", mux)
}

func Invoke(w http.ResponseWriter, r *http.Request) {
	// function to invoke remote procedure on target node
	decoder := json.NewDecoder(r.Body)

	var t Payload
	err := decoder.Decode(&t)

	if err != nil {
		panic(err)
	}

	var s Status
	go SignalFuncStart(&s)
	time.Sleep(5 * time.Second)
	fmt.Println(t.Cmd)
	out, err := exec.Command(t.Cmd).Output()
	LogOutput(string(out), s.Pid)
	go SignalFuncEnd(&s)
}

// LogOutput - send execution log to logging service
func LogOutput(out string, pid string) {
	var l Log
	l.Pid = pid
	l.Log = out

	logJSON, err := json.Marshal(l)
	if err != nil {
		panic(err)
	}
	req, err := http.NewRequest("POST", "http://localhost:8082/log", bytes.NewBuffer(logJSON))
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

// SignalFuncStat - signal status to monitoring service by making an http POST request
func SignalFuncStat(s *Status) {

	statusJSON, err := json.Marshal(s)
	if err != nil {
		panic(err)
	}
	req, err := http.NewRequest("POST", "http://localhost:8081/monitor", bytes.NewBuffer(statusJSON))
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
	fmt.Println("INFO: signalled function status")
}

// SignalFuncStart - signal function start to monitoring service
func SignalFuncStart(s *Status) {

	s.Pid = strconv.Itoa(os.Getpid())
	s.CurrStatus = "RUNNING"
	t := time.Now().UTC()
	s.StartTime = t.Format("2006-01-02 15:04:05")
	s.EndTime = "-"
	s.ExitCode = "-"
	s.ExitStatus = "-"

	SignalFuncStat(s)

}

// SignalFuncEnd - signal function end to monitoring service
func SignalFuncEnd(s *Status) {

	s.EndTime = time.Now().UTC().Format("2006-01-01 15:04:05")
	s.ExitCode = "0"
	s.CurrStatus = "COMPLETED"
	s.ExitStatus = "SUCCESS"

	SignalFuncStat(s)

}
