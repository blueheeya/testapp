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
 * 레이어 팝업을 지정된 요소 근처에 표시하는 함수
 * @param {HTMLElement} targetEl - 기준이 될 요소 (첨부파일 링크)
 * @param {HTMLElement} popupEl - 표시할 레이어 팝업 요소
 */
function showLayerPopupNearElement(targetEl, popupEl) {
    // 1. 기준 요소의 위치 구하기
    var pos = getElementPosition(targetEl);

    // 2. iOS에서 추가 보정
    if (isIOS()) {
        var scale = getViewportScale();
        // iOS에서는 scale 값을 고려해야 함
        pos.top = pos.top * scale;
        pos.left = pos.left * scale;
    }

    // 3. 팝업이 화면 밖으로 나가지 않도록 조정
    var popupWidth = popupEl.offsetWidth;
    var popupHeight = popupEl.offsetHeight;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    // 3-1. 오른쪽 경계 체크
    if (pos.left + popupWidth > windowWidth) {
        pos.left = windowWidth - popupWidth - 10; // 10px 여백
    }

    // 3-2. 아래쪽 경계 체크
    if (pos.top + popupHeight > windowHeight) {
        pos.top = pos.top - popupHeight; // 팝업을 위로 표시
    }

    // 4. 최종 위치 설정
    popupEl.style.top = pos.top + targetEl.offsetHeight + "px"; // 링크 바로 아래에 표시
    popupEl.style.left = pos.left + "px";
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
