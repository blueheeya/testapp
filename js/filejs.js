// filejs.js 파일에 추가할 함수들

/**
 * 요소의 절대 위치를 구하는 함수 (iOS 호환)
 * @param {HTMLElement} el - 위치를 찾을 요소
 * @returns {Object} top과 left 값을 포함하는 객체
 */
function getElementPosition(el) {
    var rect = el.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
    };
}

/**
 * iOS 기기인지 확인하는 함수
 * @returns {boolean} iOS 기기 여부
 */
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * viewport scale 값을 구하는 함수
 * @returns {number} viewport scale 값
 */
function getViewportScale() {
    var viewportMeta = document.querySelector("meta[name=viewport]");
    if (viewportMeta) {
        var content = viewportMeta.getAttribute("content");
        var match = content.match(/initial-scale=(\d+(\.\d+)?)/);
        if (match) {
            return parseFloat(match[1]);
        }
    }
    return 1; // 기본값
}

/**
 * 레이어 팝업을 요소 아래 및 화면 가로 중앙에 표시하는 함수
 * @param {HTMLElement} targetEl - 기준이 될 요소 (첨부파일 링크)
 * @param {HTMLElement} popupEl - 표시할 레이어 팝업 요소
 */
function showLayerPopupNearElement(targetEl, popupEl) {
    // 1. 기준 요소의 위치 구하기 (세로 위치만 사용)
    var pos = getElementPosition(targetEl);

    // 2. iOS에서 추가 보정
    if (isIOS()) {
        var scale = getViewportScale();
        // iOS에서는 scale 값을 고려해야 함
        pos.top = pos.top * scale;
    }

    // 3. 팝업 크기와 화면 크기 가져오기
    var popupHeight = popupEl.offsetHeight;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    // 4. 가로 중앙 위치 계산 - 여기에서는 JavaScript로 설정하지 않음
    // CSS의 left: 50%, transform: translateX(-50%)로 처리

    // 5. 세로 위치 조정 (화면 아래쪽 경계 체크)
    var topPosition = pos.top + targetEl.offsetHeight;
    if (topPosition + popupHeight > windowHeight) {
        topPosition = pos.top - popupHeight; // 팝업을 위로 표시
    }

    // 6. 최종 위치 설정
    popupEl.style.top = topPosition + "px";
    // left는 CSS에서 처리하므로 여기서 설정하지 않음
    popupEl.style.display = "block";
}

// IBSheet로 구현 시 사용할 이벤트 핸들러 예시
function attachPopupToAttachmentLinks() {
    // 일반 테이블에서 테스트용
    var links = document.querySelectorAll(".viewTb a");
    var popupEl = document.getElementById("layerPopup");

    // 각 링크에 이벤트 리스너 추가
    links.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // 기본 동작 방지
            showLayerPopupNearElement(this, popupEl);
        });
    });

    // 팝업 외부 클릭 시 닫기
    document.addEventListener("click", function (e) {
        if (
            !popupEl.contains(e.target) &&
            !Array.from(links).some((link) => link.contains(e.target))
        ) {
            popupEl.style.display = "none";
        }
    });
}

// 페이지 로드 후 실행
document.addEventListener("DOMContentLoaded", function () {
    attachPopupToAttachmentLinks();
});

// IBSheet 초기화 후 호출할 함수 (IBSheet 사용 시)
function initIBSheetPopup(sheet) {
    // IBSheet의 특정 셀(첨부파일 열) 클릭 이벤트 설정
    sheet.setClick(function (row, col) {
        if (
            sheet.getColProperty(col, "Type") === "Html" &&
            sheet.getValue(row, col).indexOf("첨부파일") > -1
        ) {
            var cellEl = sheet.getCellElement(row, col);
            var popupEl = document.getElementById("layerPopup");

            showLayerPopupNearElement(cellEl, popupEl);
        }
    });
}
