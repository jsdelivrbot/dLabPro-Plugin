// dLabPro Plug-in: An Eclipse plug-in for dLabPro and UASR
// - Javascript functions for update site pages
//
// AUTHOR : Matthias Wolff
// PACKAGE: n/a
//
// Copyright 2013-2014 dLabPro Plug-in contributors (see COPYRIGHT file)
// - Chair of System Theory and Speech Technology, TU Dresden
// - Chair of Communications Engineering, BTU Cottbus
//
// This file is part of dLabPro Plug-in.
//
// dLabPro Plug-in is free software: you can redistribute it and/or modify it
// under the terms of the GNU Lesser General Public License as published by 
// the Free Software Foundation, either version 3 of the License, or (at your
// option) any later version.
//
// dLabPro Plug-in is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
// or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public 
// License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with dLabPro Plug-in. If not, see [http://www.gnu.org/licenses/].

var TOC_TOGGLE   = 0;
var TOC_EXPAND   = 1;
var TOC_COLLAPSE = 2;

/**
 * Prints a section.
 * 
 * @param sId
 *          The section id.
 * @param sChapter
 *          The chapter name.
 * @param sRpath
 *          The path to the HTML root folder.
 */
function __PrintSection(sId,sChapter,sRpath)
{
	if (!sRpath) sRpath = "..";
	var iNow = new Date();
	var iWin = window.open("about:blank","_PRINT","menubar=yes,scrollbars=yes,resizable=yes");
	if (!iWin)
	{
		alert("ERROR.\n\nCannot open print preview window.\nTo use this feature, please enable popup windows.");
		return;
	}
	var sSection = "";
	try
	{
		if (!sChapter) sChapter=""; else sChapter=" - "+sChapter;
		if (sId == "cls") sId = null;
		sSection = sId ? document.getElementById(sId).innerHTML : document.getElementsByTagName("body")[0].innerHTML;
		with (iWin.document)
		{
			open();
			writeln("<html>");
			writeln("<head>");
			writeln("  <title>Print Preview "+sChapter+"</title>");
			writeln("  <link rel=stylesheet type=\"text/css\" href=\""+sRpath+"/print.css\">");
			writeln("</head>");
			writeln("<body>");
			writeln("<p class=\"small\">dLabPro Manual "+sChapter+"</p>");
			writeln(sSection);
			writeln("<p class=\"small\">Printed from the dLabPro manual.<br>");
			writeln("State: "+iNow.toLocaleString()+"<br>");
			writeln("Copyright: dLabPro contributors</p>");
			writeln("</body>");
			writeln("</html>");
			close();
		}
		iWin.print();
		// Will cause Opera to crash ... :( -->
		//iWin.setTimeout("window.close()",100);
		// <--
	}
	catch (e)
	{
		alert("ERROR.\n\nUnable to create print preview.");
		iWin.close();
	}	
}

/**
 * Initial folding of the TOC tree.
 * 
 * @param sRootNode
 *          The root node id.
 */
function __tocInit(sRootNode)
{
  var iRoot  = document.getElementById(sRootNode);
  var aiDivs = iRoot.getElementsByTagName("div");
  
  for (i=0; i<aiDivs.length; i++)
  {
	if (aiDivs[i].className!="tocNode") continue;
	if (aiDivs[i].id=="" || aiDivs[i].id=="tocDocumentation") continue;
	//if (aiDivs[i].id=="tocClasses") continue;
	// HACK: IE will get stuck when invoking __tocToggle directly 
	window.setTimeout("__tocToggle(\""+aiDivs[i].id+"\",TOC_COLLAPSE)",10);
  }
}

/**
 * Toggles a TOC node.
 * 
 * @param sNode
 *          The node id.
 * @param nMode
 *          <code>TOC_TOGGLE</code> (default), <code>TOC_EXPAND</code>, or
 *          <code>TOC_COLLAPSE</code>
 */
function __tocToggle(sNode,nMode)
{
  if (!nMode) nMode = TOC_TOGGLE;
  
  var iParent = document.getElementById(sNode);
  var aIAs = iParent.getElementsByTagName("a");
  if (aIAs.length==0 || aIAs[0].innerHTML.indexOf("[")!=0) return;
  
  var sDisplay;
  if (aIAs[0].innerHTML.indexOf("[+]")==0)
	sDisplay = (nMode==TOC_COLLAPSE ? "none" : "");
  else
	sDisplay = (nMode==TOC_EXPAND ? "" : "none");
  
  var aiDivs  = iParent.getElementsByTagName("div");
  for (i=0; i<aiDivs.length; i++)
  {
    var iDiv = aiDivs[i];
    iDiv.style.display = sDisplay;
  }
  aIAs[0].innerHTML = ( sDisplay=="" ? "[&minus;]" : "[+]" );
}

/**
 * Navigates to a named anchor in the UASR manual.
 * 
 * @param sUrl
 *          The URL, relative to the UASR manual root directory, of the 
 *          dLabPro manual page to navigate to (optional, default is
 *          <code>null</code> which navigates to the home page).
 * @param sHash
 *          The anchor name on the UASR manual page to navigate to 
 *          (optional, default is <code>null</code> which navigates to the top
 *          of the page).
 */
function __goUasr(sUrl,sHash)
{
  var sLocation = "..";
  try
  {
	sLocation = __sRootPath;
  }
  catch (e) {}
  sLocation += "/../uasr/manual/index.html";
  if (sUrl ) sLocation += "?"+sUrl;
  if (sHash) sLocation += ";"+sHash;
  var iWnd = window.open(sLocation,"UASR");
  iWnd.focus();
}

// EOF
