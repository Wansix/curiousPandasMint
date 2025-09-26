# 큐리어스 판다스 민팅 사이트 (Curious Pandas Mint)

큐리어스 판다스 NFT 민팅을 위한 React 기반 웹 애플리케이션입니다. 클레이튼(Klaytn) 블록체인에서 작동하며, 화이트리스트와 퍼블릭 민팅 단계를 지원합니다.

## 📋 프로젝트 개요

- **프로젝트명**: Curious Pandas NFT 민팅 사이트
- **블록체인**: Klaytn (Baobab 테스트넷 / Cypress 메인넷)
- **프레임워크**: React 18.2.0
- **스타일링**: Bootstrap 5.3.0, React Bootstrap 2.7.4
- **지갑 연동**: MetaMask, Kaikas

## 🚀 주요 기능

### 1. 민팅 시스템
- **3단계 민팅 프로세스**:
  - 확정 화이트리스트 라운드 (트랜잭션당 2개, 지갑당 2개)
  - 경쟁 화이트리스트 라운드 (트랜잭션당 1개, 지갑당 2개)
  - 퍼블릭 라운드 (트랜잭션당 1개, 지갑당 1개)

### 2. 화이트리스트 관리
- 화이트리스트 주소 추가/제거 기능
- 화이트리스트 상태 확인 기능
- 단계별 화이트리스트 관리

### 3. 관리자 기능
- 민팅 단계 진행 관리
- 민팅 가격 설정
- 민팅 시간 설정 (블록 높이 기반)
- 화이트리스트 관리
- 민팅 통계 확인

### 4. 사용자 인터페이스
- 실시간 블록 높이 표시
- 민팅 진행률 표시
- 남은 시간 카운트다운
- 지갑 연결 (MetaMask, Kaikas)

### 5. 커뮤니티 검증 시스템
- **Discord NFT 홀더 검증**: NFT 소유자에게 Discord 롤 자동 부여
- **밤부숲 커뮤니티 검증**: 밤부숲 커뮤니티 회원 지갑 등록 시스템 (서비스 종료)

## 🛠 기술 스택

### Frontend
- **React**: 18.2.0
- **React Router**: 6.13.0 (라우팅)
- **Bootstrap**: 5.3.0 (UI 프레임워크)
- **React Bootstrap**: 2.7.4 (React용 Bootstrap 컴포넌트)
- **Framer Motion**: 10.16.4 (애니메이션)
- **SweetAlert2**: 11.7.12 (알림 모달)

### Blockchain
- **Ethers.js**: 5.7.1 (이더리움/Klaytn 상호작용)
- **Caver-js**: 1.10.2 (Klaytn 전용 라이브러리)

### 기타
- **Axios**: 1.4.0 (HTTP 클라이언트)
- **Crypto-js**: 4.1.1 (암호화)
- **Dotenv**: 16.1.4 (환경변수 관리)

## 📁 프로젝트 구조

```
curiousPandasMint/
├── public/
│   ├── cpd_jsons/          # NFT 메타데이터 (540개)
│   ├── testJsons/          # 테스트용 메타데이터 (500개)
│   ├── mintImage/          # NFT 이미지 파일들 (540개)
│   └── images/             # 기타 이미지 파일
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── WalletConnect.js # 지갑 연결 컴포넌트
│   │   └── ImageList.js     # 이미지 리스트 컴포넌트
│   ├── screens/            # 페이지 컴포넌트
│   │   ├── Main.js         # 메인 페이지 (외부 사이트 임베드)
│   │   ├── MintPage.js     # 민팅 페이지
│   │   ├── AdminBamboo.js  # 관리자 페이지
│   │   ├── CheckWhiteList.js # 화이트리스트 확인
│   │   ├── VerifyBamboo.js # 검증 페이지
│   │   └── VerifyNFTHolder.js # NFT 홀더 검증
│   ├── contracts/          # 스마트 컨트랙트 관련
│   │   ├── abi.js          # 컨트랙트 ABI
│   │   ├── address.js      # 컨트랙트 주소
│   │   └── index.js        # 컨트랙트 상호작용 함수들
│   ├── css/                # 스타일시트
│   └── fonts/              # 폰트 파일
└── package.json
```

## 🔧 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 스마트 컨트랙트
REACT_APP_CPD_CONTRACT=컨트랙트_주소

# Klaytn RPC 엔드포인트 (테스트넷)
REACT_APP_BAOBAB_ENDPOINT1=테스트넷_RPC_엔드포인트1
REACT_APP_BAOBAB_ENDPOINT2=테스트넷_RPC_엔드포인트2
REACT_APP_BAOBAB_ENDPOINT3=테스트넷_RPC_엔드포인트3

# Klaytn RPC 엔드포인트 (메인넷)
REACT_APP_MAINNET_ENDPOINT1=메인넷_RPC_엔드포인트1
REACT_APP_MAINNET_ENDPOINT2=메인넷_RPC_엔드포인트2
REACT_APP_MAINNET_ENDPOINT3=메인넷_RPC_엔드포인트3
REACT_APP_MAINNET_ENDPOINT4=메인넷_RPC_엔드포인트4

# Discord OAuth (선택사항)
REACT_APP_DISCORD_CLIENT_ID=Discord_클라이언트_ID
REACT_APP_DISCORD_CLIENT_SECRET=Discord_클라이언트_시크릿
REACT_APP_DISCORD_REDIRECT_URI=Discord_리다이렉트_URI

# API 엔드포인트 (선택사항)
REACT_APP_BAMBOO_API_URL=대나무_API_URL
REACT_APP_BAMBOO_URL=대나무_웹사이트_URL
```

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 프로덕션 빌드
```bash
npm run build
```

## 📱 페이지 구성

### 1. 메인 페이지 (`/`)
- 외부 사이트(https://kkad.creatorlink.net/)를 iframe으로 임베드

### 2. 민팅 페이지 (`/MintPage`, `/MintTest`)
- 실시간 민팅 상태 표시
- 블록 높이 기반 카운트다운
- 민팅 진행률 표시
- 화이트리스트/퍼블릭 민팅 지원

### 3. 관리자 페이지 (`/AdminBamboo`)
- 민팅 단계 관리
- 가격 설정
- 화이트리스트 관리
- 민팅 통계 확인

### 4. 화이트리스트 확인 (`/CheckWhiteList`)
- 사용자 화이트리스트 상태 확인

### 5. 커뮤니티 검증 페이지들
- **`/VerifyBamboo`**: 밤부숲 커뮤니티 지갑 등록 (서비스 종료)
  - 밤부숲 커뮤니티 회원 인증 (서비스 종료)
  - 지갑 주소와 커뮤니티 계정 연결 (서비스 종료)
  - iframe 통신을 통한 안전한 데이터 전송 (서비스 종료)
- **`/verify_nft_holder`**: Discord NFT 홀더 검증
  - Discord OAuth 인증
  - NFT 소유권 확인
  - Discord 서버 자동 롤 부여

## 🎨 NFT 메타데이터

각 NFT는 다음과 같은 속성을 가집니다:
- **Background**: sky, rainbow 등
- **Skin**: black, basic 등
- **Eyes**: angry 등
- **Clothes**: none, white T 등
- **Glasses**: none 등
- **Hat**: none 등
- **Objects**: knife, meat 등
- **Mouth**: match1, basic mouth 등

## 🔗 스마트 컨트랙트

### 컨트랙트 정보
- **컨트랙트 주소**: `0xEce5e2eA365a943629A7e18004861ebce24214Fa`
- **네트워크**: Klaytn Cypress (메인넷)
- **컨트랙트 이름**: CuriousPandasNFT

### 주요 함수들
- `batchMintNFT()`: NFT 배치 민팅
- `addToWhitelist()`: 화이트리스트 추가
- `advancePhase()`: 민팅 단계 진행
- `setMintPrice()`: 민팅 가격 설정
- `setMintBlockTime()`: 민팅 시간 설정

### 민팅 단계 (Phase)
1. **INIT**: 초기화
2. **WHITELIST1**: 확정 화이트리스트
3. **WAITING_WHITELIST2**: 경쟁 화이트리스트 대기
4. **WHITELIST2**: 경쟁 화이트리스트
5. **WAITING_PUBLIC1**: 퍼블릭 대기
6. **PUBLIC1**: 퍼블릭 민팅
7. **DONE**: 민팅 종료

## 🌐 네트워크 지원

- **테스트넷**: Klaytn Baobab (Chain ID: 1001)
- **메인넷**: Klaytn Cypress (Chain ID: 8217)

## 📊 민팅 통계

- **총 NFT 수량**: 3,000개
- **1차 물량**: 500개 (팀 물량)
- **마케팅/민팅용**: 2,000개
- **실제 발행량**: 540개 NFT
- **보유 지갑**: 151개 지갑
- **고유 보유자 비율**: 27.96%
- **이미지 파일**: 540개 PNG 파일
- **메타데이터**: 540개 JSON 파일

## 🌐 커뮤니티 연동

### Discord 서버 연동
- **NFT 홀더 자동 롤 부여**: 큐리어스 판다스 NFT 소유자에게 Discord 서버에서 특별 롤 자동 부여
- **OAuth 2.0 인증**: 안전한 Discord 계정 연동
- **실시간 검증**: 블록체인에서 실시간 NFT 소유권 확인

### 밤부숲 커뮤니티 연동 (서비스 종료)
- **지갑 등록 시스템**: 밤부숲 커뮤니티 회원의 지갑 주소 등록 (서비스 종료)
- **iframe 통신**: 밤부숲 웹사이트와 안전한 데이터 교환 (서비스 종료)
- **암호화된 데이터**: 사용자 정보 보호를 위한 암호화 전송 (서비스 종료)
- **C2E 시스템**: NFT 홀더들에게 $BBP 토큰 보상 제공 (서비스 종료)
- **상태**: 밤부숲 커뮤니티 서비스 종료

## 🔒 보안 기능

### 민팅 보안
- 화이트리스트 검증
- 지갑당 민팅 한도 제한
- 트랜잭션당 민팅 한도 제한
- 블록 높이 기반 시간 제한
- 네트워크 검증

### 커뮤니티 검증 보안
- **Discord 검증**: OAuth 2.0 인증, 메시지 서명 검증, NFT 소유권 확인 (서비스 종료)
- **밤부숲 검증**: 암호화된 데이터 전송, iframe 보안 통신, 서명 검증 (서비스 종료)

## 🛒 마켓플레이스

- **OKX NFT 마켓플레이스**: [https://web3.okx.com/nft/collection/kaia/curiouspandas](https://web3.okx.com/nft/collection/kaia/curiouspandas)
- **네트워크**: KAIA (Klaytn)
- **총 거래량**: 1.92K KAIA
- **현재 상태**: 활성 리스팅 없음 (오퍼 가능)





---

**Curious Pandas NFT** - 큐리어스한 판다들과 함께하는 블록체인 여행! 🐼✨