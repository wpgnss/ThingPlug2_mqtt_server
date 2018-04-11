# ThingPlug2_mqtt_server


## 사용 방법

#### 1. node.js 다운로드
 - https://nodejs.org/ko/

#### 2. 프로젝트에 사용되는 모듈 다운로드
 - dos창에서 아래 명령 실행
 - npm install
 

#### 3. 환경 설정
  - /routes/tp_descriptor.js
    -  디바이스 생성시 사용한 명세 입력
  
  - /routes/tp_devicelist.js
    - service: ThingPlug Service name
    - devicelist-name: Device name
    - id: 디바이스 식별 ID(1~999999999), App 서버에서 관리해야 함

#### 4. 서버 시작
  - dos창에서 아래 명령 실행
  - node server.js -u {tp_id} -p {tp_pwd}
    - tp_id: thingplug portal id
    - tp_pwd: thingplug portal password
    
  - devicelist-status가 running인 단말 대상으로 enlist
    
 #### 5. 단말 제어 RPC(oneway)
  - dos창에서 아래 명령 실행
  - node server.js -u {tp_id} -p {tp_pwd} -c -i {interval}
    - tp_id: thingplug portal id
    - tp_pwd: thingplug portal password
    - c: 주기적으로 RPC 명령(devicelist-status가 running인 단말 대상)
    - i: RPC 명령 주기 (ms)
   
