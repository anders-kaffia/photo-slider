<!DOCTYPE html>
<html>
    <head>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="css/style.css">
		<link href='https://fonts.googleapis.com/css?family=Raleway:400,600' rel='stylesheet' type='text/css'>
    	<title>Bildspel</title>
    </head>
<body>
	<div id="container">
		<div id="uploadFormContainer">
			<div id="uploadForm">
				<h2>Här kan du ladda upp en ny bild</h2>
				<form method="post" enctype="multipart/form-data">
					<label class="fileContainer">
				    	Välj en bild
				    	<input type="file" name="min_bild"><br><br>
				    </label>
				    <div class="inputAlign">
					    <span>Beskrivning:</span>
					    <input type="text" name="caption"><br>
					    <span>Datum:</span>
					    <input type="text" name="date">
				    </div>
				    <label class="fileContainer">
				    	Klicka för att lägga till bilden
				    	<input type="submit" name="add_img">
				    </label>
				    <nav>
				    	<h3><a href="index.html">Gå till bildspelet</a></h3>
				    </nav>
				</form>
			</div>
		</div>
		<div class="adminImgContainer">
			<?php
			$xml = simplexml_load_file("images.xml");
			$sxe = new SimpleXMLElement($xml->asXML());
			// Laddar upp en bild till mappen uploads
			if(isset($_POST['add_img'])) {
				$target_folder = "uploads/";
				$target_name = $target_folder . basename($_FILES["min_bild"]["name"]);
				// Kontrollerar filnamnet för att undvika dubbletter
				if(file_exists($target_name)) {
				  echo "Filen finns redan! <a href='admin.php'>Gå tillbaka</a>";
				  exit;
				}
				// Kontrollerar filstorlek
				if($_FILES["min_bild"]["size"] > 1000000) {
				  echo "Filen är för stor :(";
				  exit;
				}
				// Kontrollerar filtyp
				$type = pathinfo($target_name, PATHINFO_EXTENSION);
				if($type != "jpg") {
					echo "Du får bara ladda upp JPG-filer";
					exit;
				}			      
				// Flyttar filen, och lägger till noder i XML-dokumentet
				if(move_uploaded_file($_FILES["min_bild"]["tmp_name"], $target_name)) {
					echo "<br><br>Filen uppladdad! ";
					$new_item = $sxe->addChild("image");
					$new_item->addChild("caption", $_POST['caption']);
					$new_item->addChild("path", $target_name);
					$new_item->addChild("date", $_POST['date']);
					$new_item->addAttribute("id", $target_name);
					$sxe->asXML("images.xml");
				} else {
					echo "Gick inte att ladda upp bilden!";
				}
				unset($_POST);
			}
			// Tar bort bildfilen och tillhörande XML-noder
			if(isset($_POST['deleteImg'])) {
				$filename = $_POST["filename"];
				echo $filename;
				unset($sxe->xpath("image[@id='".$filename."']")[0]->{0});
				$sxe->asXML("images.xml");
				if(file_exists($filename)) {
					// Om filen finns, ta bort den
					if(unlink($filename)) {
						echo "<p>Filen borttagen!</p>";
					}
				} else {
					echo "<p>Filen existerar inte!</p>";
				}
			}
			// Loopar ut formuläret(deleteknappen) + bild
			foreach ($sxe as $images) {
				echo "<div class='picAdmin'>$images->caption <br>";
				echo $images->date . "<br>"; 
				echo "<img src='".$images->path."'>";
				echo "	<form method='post'>
							<input type='hidden' name='filename' value='".$images->path."'>
							<input type='submit' name='deleteImg' value='Ta bort bilden'>
						</form>
					</div>";
			}
			?>
		</div>
	</div>
</body>
</html>