window.kode = `<tr>
  <td><input type="text" class="matkul w-full p-2 border-b border-gray-300 rounded text-center"></td>
  <td><input type="tel" class="sks w-full p-2 border-b border-gray-300 rounded text-center" value="" min="0" max="50"></td>
  <td><input type="tel" class="tugas w-full p-2 border-b border-gray-300 rounded text-center" value="" min="0" max="100"></td>
  <td><input type="tel" class="uts w-full p-2 border-b border-gray-300 rounded text-center" value="" min="0" max="100"></td>
  <td><input type="tel" class="uas w-full p-2 border-b border-gray-300 rounded text-center" value="" min="0" max="100"></td>
  <td>
    <select class="sistem-hitung w-full p-2 border-b border-gray-300 rounded text-center">
	  <option value="1">TM 30%, UTS 30%, UAS 40%</option>
      <option value="2">TM 50%, UTS 20%, UAS 30%</option>
    </select>
  </td>
  <td class="nilai p-2 text-center"></td>
  <td class="grade p-2 text-center"></td>
  <td class="text-center">
    <button class="bg-red-500 text-white px-2 py-1 rounded tombolhapus">DELETE</button>
  </td>
</tr>`;

function tambahkan() {
	$('table#nilai tbody').append(window.kode);
}

function ValidNIM() {
	var A = document.getElementById("nim").value;
	if (isNaN(A)) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'NIM harus berupa angka!',
			confirmButtonColor: '#db2e2e',
		});
	}
}

function validateInput(inputElement) {
    let value = inputElement.value.trim();
    if (value === '') {
        value = '0';
    }
    let regex = /^(100|[1-9]?\d([.,]\d{1,2})?)$/;
    if (!regex.test(value) || parseFloat(value.replace(',', '.')) < 0 || parseFloat(value.replace(',', '.')) > 100) {
        inputElement.value = '0'; // set nilai awal jadi 0
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Nilai harus dari 0-100 !',
            confirmButtonColor: '#db2e2e',
        });
    }
}

function hitungipk() {
    var total_matkul = $('table#nilai tbody tr').length;
    var total_sks = 0;
    var total_poin = 0;
    var nama = $('#nama').val();
    var nim = $('#nim').val();

    if (nama.trim().length == 0 || nim.trim().length == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NIM dan Nama harus di isi ya!',
            confirmButtonColor: '#db2e2e',
        });
        return;
    }

    $('#result').hide();

    $('table#nilai tbody tr').each(function () {
        var sks = parseInt($(this).find('.sks').val());
        var tugas = parseFloat($(this).find('.tugas').val().replace(',', '.'));
        var uts = parseFloat($(this).find('.uts').val().replace(',', '.'));
        var uas = parseFloat($(this).find('.uas').val().replace(',', '.'));
        var sistem = $(this).find('.sistem-hitung').val();

        var nilaiAkhir;
        if (sistem == '1') {
            nilaiAkhir = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);
        } else {
            nilaiAkhir = (tugas * 0.5) + (uts * 0.2) + (uas * 0.3);
        }

        var roundedNilaiAkhir = Math.round(nilaiAkhir * 10) / 10;
        var formattedNilaiAkhir = roundedNilaiAkhir.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

        var nilai = $(this).find('.nilai');
        nilai.html(formattedNilaiAkhir);

        var grade = $(this).find('.grade');
        var poin;
        if (roundedNilaiAkhir >= 80 && roundedNilaiAkhir <= 100) {
            grade.html('A');
            poin = 4;
        } else if (roundedNilaiAkhir >= 73 && roundedNilaiAkhir < 80) {
            grade.html('B+');
            poin = 3.5;
        } else if (roundedNilaiAkhir >= 66 && roundedNilaiAkhir < 73) {
            grade.html('B');
            poin = 3;
        } else if (roundedNilaiAkhir >= 58 && roundedNilaiAkhir < 66) {
            grade.html('C+');
            poin = 2.5;
        } else if (roundedNilaiAkhir >= 51 && roundedNilaiAkhir < 58) {
            grade.html('C');
            poin = 2;
        } else if (roundedNilaiAkhir >= 41 && roundedNilaiAkhir < 51) {
            grade.html('D');
            poin = 1;
        } else if (roundedNilaiAkhir >= 0 && roundedNilaiAkhir < 41) {
            grade.html('E');
            poin = 0;
        } else {
            grade.html('K');
            poin = 0;
        }

        total_sks += sks;
        total_poin += (sks * poin);
    });

    var ipk = total_poin / total_sks;
	console.log(total_poin)

    var selamat;
    if (ipk.toFixed(1) >= 4) {
        selamat = '<img src="img/happy.jpg" width="150" height="150"></img><br>Selamat nilai anda sangat memuaskan, jangan lupa pertahankan nilai anda.';
    } else if (ipk.toFixed(1) >= 3) {
        selamat = '<img src="img/stillgood.jpg" width="150" height="150"></img><br>Nilai kamu lumayan memuaskan, jangan lupa tetap belajar dan tingkatkan lagi di semester selanjutnya.';
    } else if (ipk.toFixed(1) >= 2) {
        selamat = '<img src="img/sad.jpg" width="150" height="150"></img><br>Nilai anda kurang bagus, semangat dan jangan lupa tingkatkan di semester selanjutnya.';
    } else {
        selamat = '<img src="img/angry.jpg" width="150" height="150"></img><br>Nilai kamu sangat memprihatinkan, jangan lupa belajar lagi untuk meningkatkan nilai di semester selanjutnya.';
    }

    $('#loading .bar').animate({ width: '100%' }, 500);
    setTimeout(function () {
        $('#result_nim').html(nim);
        $('#result_nama').html(nama);
        $('#result_sks').html(total_sks);
        $('#result_matkul').html(total_matkul);
        $('#result_ipk').html(ipk.toFixed(2).replace('.', ','));
        $('#selamat').html(selamat);
        $('#result').fadeIn('slow');
    }, 1500);
    setTimeout(function () {
        $('#loading .bar').animate({ width: '0%' }, 500);
    }, 2500);
}

function reset() {
	Swal.fire({
		title: 'Anda yakin?',
		text: "Anda akan mereset semua data yang telah dimasukan!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#1fad4c',
		cancelButtonColor: '#db2e2e',
		confirmButtonText: 'Ya, Dong',
		cancelButtonText: 'Ga jadi'
	}).then((result) => {
		if (result.isConfirmed) {
			$('table#nilai tbody tr').remove();
			$('table#nilai tbody').append(window.kode);
			$('#nama, #nim').val('');
			$('#result').hide();

			Swal.fire({
				title: 'Reset!',
				text: 'Semua input telah direset.',
				icon: 'success',
				confirmButtonColor: '#1fad4c',
			});
		}
	});
}

$(document).ready(function () {
	$('.container').hide().fadeIn('slow');
	$('table#nilai').on('keydown keyup change focus', '.sks, .tugas, .uts, .uas, .sistem-hitung', function (e) {
		var tugas = $(this).closest('tr').find('.tugas').val().replace(',', '.'); // replace , jadi . karna js ga baca , sbg koma di angka
		var uts = $(this).closest('tr').find('.uts').val().replace(',', '.');
		var uas = $(this).closest('tr').find('.uas').val().replace(',', '.');
		var sistem = $(this).closest('tr').find('.sistem-hitung').val();

		var nilaiAkhir;
		if (sistem == '1') {
			nilaiAkhir = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);
		} else {
			nilaiAkhir = (tugas * 0.5) + (uts * 0.2) + (uas * 0.3);
		}

		var roundedNilaiAkhir = Math.round(nilaiAkhir * 10) / 10;
		var formattedNilaiAkhir = roundedNilaiAkhir.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

		var nilai = $(this).closest('tr').find('.nilai');
		nilai.html(formattedNilaiAkhir);

		var grade = $(this).closest('tr').find('.grade');
		if (roundedNilaiAkhir >= 80 && roundedNilaiAkhir <= 100) {
		    grade.html('A');
		} else if (roundedNilaiAkhir >= 73 && roundedNilaiAkhir < 80) {
		    grade.html('B+');
		} else if (roundedNilaiAkhir >= 66 && roundedNilaiAkhir < 73) {
		    grade.html('B');
		} else if (roundedNilaiAkhir >= 58 && roundedNilaiAkhir < 66) {
		    grade.html('C+');
		} else if (roundedNilaiAkhir >= 51 && roundedNilaiAkhir < 58) {
		    grade.html('C');
		} else if (roundedNilaiAkhir >= 41 && roundedNilaiAkhir < 51) {
		    grade.html('D');
		} else if (roundedNilaiAkhir >= 0 && roundedNilaiAkhir < 41) {
		    grade.html('E');
		} else {
		    grade.html('F');
		}

	}).on('click', '.tombolhapus', function () {
		Swal.fire({
			title: 'Anda yakin?',
			text: "Anda akan menghapus mata kuliah ini!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#1fad4c',
			cancelButtonColor: '#db2e2e',
			confirmButtonText: 'Ya, hapus!',
			cancelButtonText: 'Batal'
		}).then((result) => {
			if (result.isConfirmed) {
				$(this).closest('tr').slideUp('slow', function () {
					$(this).remove();
				});
				Swal.fire({
					title: 'Terhapus!',
					text: 'Matakuliah berhasil dihapus.',
					icon: 'success',
					confirmButtonColor: '#1fad4c',
				});
			}
		});
	});

	$('.sks, .tugas, .uts, .uas').focus(function () {
		var $this = $(this);
		$this.select();

		$this.mouseup(function () {
			$this.unbind("mouseup");
			return false;
		});
	});

	// update: menampahkan tbody
	$('table#nilai').on('input', 'tbody .tugas, tbody .uts, tbody .uas', function () {
		validateInput(this); // validasi nilai yang diinput
	});
});