<template>
  <div :class="isEditMode ? 'edit-mode' : 'read-mode'">
    <!-- Page Container -->
    <div class="page-container">
      
      <!-- Header -->
      <header class="header-section">
        <div class="header">
          <!-- Menu Button -->
          <button class="menu-button" aria-label="Menu">
            <cdx-icon :icon="cdxIconMenu" size="medium" />
          </button>

          <!-- Wikipedia Logo -->
          <div class="wikipedia-logo">
            <img :src="wikipediaGlobe" alt="Wikipedia globe" class="wikipedia-globe" />
            <div class="wikipedia-text">
              <div class="wikipedia-title">WIKIPEDIA</div>
              <div class="wikipedia-tagline">The Free Encyclopedia</div>
            </div>
          </div>

          <!-- Search -->
          <div class="search-container">
            <cdx-typeahead-search
              id="typeahead-search-wikipedia"
              form-action="https://en.wikipedia.org/w/index.php"
              :use-button="true"
              :search-results="searchResults"
              :search-footer-url="searchFooterUrl"
              :show-thumbnail="true"
              :highlight-query="true"
              :auto-expand-width="true"
              placeholder="Search"
              @input="onSearchInput"
              @search-result-click="onSearchResultClick"
              @submit="onSearchSubmit"
            >
              <template #default>
                <input type="hidden" name="language" value="en">
                <input type="hidden" name="title" value="Special:Search">
              </template>
              <template #search-footer-text="{ searchQuery }">
                Search Wikipedia for pages containing
                <strong class="cdx-typeahead-search__search-footer__query">
                  {{ searchQuery }}
                </strong>
              </template>
            </cdx-typeahead-search>
          </div>

          <!-- User Tools -->
          <div class="user-tools">
            <a href="#" class="user-link">User1234</a>
            <button class="icon-btn" aria-label="Notifications">
              <cdx-icon :icon="cdxIconBell" size="medium" />
            </button>
            <button class="icon-btn" aria-label="Messages">
              <cdx-icon :icon="cdxIconTray" size="medium" />
            </button>
            <button class="icon-btn" aria-label="Watchlist">
              <cdx-icon :icon="cdxIconWatchlist" size="medium" />
            </button>
            <button class="user-menu-btn" aria-label="User menu">
              <cdx-icon :icon="cdxIconUserAvatar" size="medium" />
              <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <div class="main-content-area" :class="{ 'has-suggestions': showSuggestions }">
        
        <!-- Table of Contents (Left Sidebar) - Only visible in Read mode -->
        <aside v-if="!isEditMode" class="toc-sidebar">
          <div class="toc-container">
            <div class="toc-header">
              <h2 class="toc-title">Contents</h2>
              <button class="toc-toggle">hide</button>
            </div>
            
            <nav class="toc-nav">
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link toc-link-bold">(Top)</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Early life</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Career</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Poetry</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Prose</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Film</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Theory</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Lorde and womanism</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Personal life</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Last years</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Honors</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Legacy</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Works</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">See also</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Notes</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">References</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Further reading</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">External links</a>
              </div>
            </nav>
          </div>
        </aside>

        <!-- Article Content (Center) -->
        <article class="article">
          <div class="article-chrome">
            <!-- Title and Toolbar -->
            <div class="title-toolbar">
              <div class="article-title-section">
                <div class="title-and-language">
                  <button class="toc-toggle-btn" aria-label="Toggle table of contents">
                    <cdx-icon :icon="cdxIconListBullet" size="medium" />
                  </button>
                  <h1 class="article-title">Audre Lorde</h1>
                  <button class="language-button">
                    <cdx-icon :icon="cdxIconLanguage" size="medium" class="language-icon" />
                    <span class="language-text">95 Languages</span>
                    <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-small" />
                  </button>
                </div>
                <div class="title-divider"></div>
              </div>

              <div class="toolbar">
                <div class="tabs">
                  <div class="tabs-start">
                    <div class="tab tab-selected">
                      <span class="tab-text">Article</span>
                      <div class="tab-indicator"></div>
                    </div>
                    <div class="tab">
                      <span class="tab-text tab-link">Talk</span>
                    </div>
                  </div>
                  
                  <div class="tabs-end">
                    <div class="tab" :class="{ 'tab-selected': !isEditMode }" @click="isEditMode = false">
                      <span class="tab-text" :class="{ 'tab-link': isEditMode }">Read</span>
                      <div v-if="!isEditMode" class="tab-indicator"></div>
                    </div>
                    <div class="tab" :class="{ 'tab-selected': isEditMode }" @click="toggleEditMode">
                      <span class="tab-text" :class="{ 'tab-link': !isEditMode }">Edit</span>
                      <div v-if="isEditMode" class="tab-indicator"></div>
                    </div>
                    <div class="tab">
                      <span class="tab-text tab-link">View history</span>
                    </div>
                    <button class="tab-icon-btn">
                      <cdx-icon :icon="cdxIconStar" size="medium" />
                    </button>
                    <button class="tools-toggle-btn" aria-label="Toggle tools">
                      <span class="tools-toggle-text">Tools</span>
                      <cdx-icon :icon="cdxIconExpand" size="small" />
                    </button>
                  </div>
                </div>
                <div class="toolbar-divider"></div>
              </div>
            </div>

            <p v-if="!isEditMode" class="article-tagline">From Wikipedia, the free encyclopedia</p>
          </div>

          <!-- Article Content -->
          <div v-if="!isEditMode" class="article-content-section">
            <div class="article-ve-contents">
              <div class="article-content-grid">
                <!-- Main Article Text -->
                <div class="article-text">
                  <div class="intro-text">
                    <p>
                      <strong>Audre Lorde</strong> (<a href="#">/ˈɔːdri ˈlɔːrd/</a> <em>AW-dree LORD</em>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, professor, philosopher, intersectional <a href="#">feminist</a>, <a href="#">poet</a> and <a href="#">civil rights activist</a>. She was a self-described "Black, lesbian, feminist, socialist, mother, warrior, poet" who dedicated her life and talents to confronting different forms of injustice, as she believed there could be "no hierarchy of oppressions" among "those who share the goals of liberation and a workable future for our children".
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      As a poet, she is well known for technical mastery and emotional expression, as well as her poems that express anger and outrage at civil and social injustices she observed throughout her life. She was the recipient of national and international awards and the founding member of <em>Kitchen Table: Women of Color Press</em>. As a <a href="#">spoken word</a> artist, her delivery has been called powerful, melodic, and intense by the Poetry Foundation. Her poems and prose largely deal with issues related to civil rights, feminism, lesbianism, illness, disability, and the exploration of Black female identity.
                    </p>
                  </div>

                  <!-- Early Life Section -->
                  <div class="section-heading">
                    <h2 class="heading-text">Early life</h2>
                    <div class="heading-divider"></div>
                  </div>

                  <div class="body-text">
                    <p>
                      Audre Lorde was born on February 18, 1934, in <a href="#">New York City</a> to Caribbean immigrants Frederick Byron Lorde and Linda Gertrude Belmar Lorde. Her father, Frederick Byron Lorde (Byron), was born on April 20, 1898, in <a href="#">Barbados</a>. Her mother, Linda Gertrude Belmar Lorde, was born in 1902 on the island <a href="#">Carriacou</a> in <a href="#">Grenada</a>. Lorde's mother was a light-skinned Black woman but sometimes passed as Spanish, for employment opportunities. Lorde's father was darker than the Belmar family liked, and they only allowed the couple to marry because of Byron's charm, ambition, and persistence. After their immigration, the new family settled in <a href="#">Harlem</a>, a diverse neighborhood in upper Manhattan, New York. Lorde was the youngest of three daughters. Lorde was nearsighted to the point of being legally blind. At the age of four she learned to read at the same time she learned to talk, with the help of Augusta Braxton Baker, then children's librarian at the 135th Street Branch of the New York Public Library. Her mother taught her to write at around the same time.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Born Audrey Geraldine Lorde, she chose to drop the "y" from her first name while still a child, explaining in <em><a href="#">Zami: A New Spelling of My Name</a></em> that she was more interested in the artistic symmetry of the "e"-endings in the two side-by-side names "Audre Lorde" than in spelling her name the way her parents had intended.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      Lorde's relationship with her parents was difficult from a young age. She spent very little time with her father and mother, who were both busy maintaining their property management business in the tumultuous economy after <a href="#">the Great Depression</a>. When she did see them, they were often cold or emotionally distant. In particular, Lorde's relationship with her mother, who was deeply suspicious of people with darker skin than hers (which Lorde had) and the outside world in general, was characterized by "tough love" and strict adherence to family rules. Lorde's difficult relationship with her mother figured prominently in her later poems, such as <em>Coal</em>'s "Story Books on a Kitchen Table"
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      As a child, Lorde struggled with communication, and came to appreciate the power of poetry as a form of expression. She even described herself as thinking in poetry, stating that she would always "see things in terms of poetry". She explains that it was a way for her to understand and articulate her feelings. She went on to state that it was her way of "birthing myself into a world that I could bring into myself".
                    </p>
                  </div>
                </div>

                <!-- Infobox -->
                <aside class="infobox">
                  <div class="infobox-title">Audre Lorde</div>
                  
                  <div class="infobox-image-section">
                    <div class="infobox-image">
                      <img :src="audreImage" alt="Audre Lorde in 1980" />
                    </div>
                    <div class="infobox-caption">Lorde in 1980</div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Born</div>
                    <div class="infobox-value">
                      Audrey Geraldine Lorde<br>
                      February 18, 1934[1]<br>
                      <a href="#">New York City</a>, U.S.
                    </div>
                  </div>

                  <div class="infobox-row infobox-row-faded">
                    <div class="infobox-label">Died</div>
                    <div class="infobox-value">
                      November 17, 1992 (aged 58)<br>
                      <a href="#">Saint Croix, Virgin Islands</a>, U.S.
                    </div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Education</div>
                    <div class="infobox-value infobox-value-link">
                      <a href="#">National Autonomous University of Mexico</a><br>
                      <a href="#">Hunter College (BA)</a><br>
                      <a href="#">Columbia University (MLS)</a>
                    </div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Genre</div>
                    <div class="infobox-value">
                      Poetry<br>
                      Nonfiction
                    </div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Notable works</div>
                    <div class="infobox-value infobox-value-link">
                      The First Cities<br>
                      <a href="#">Zami: A New Spelling of My Name</a><br>
                      <a href="#">The Cancer Journals</a>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <!-- Career Section -->
            <div class="section-heading">
              <h2 class="heading-text">Career</h2>
              <div class="heading-divider"></div>
            </div>

            <div class="body-text">
              <p>
                In 1954, she spent a pivotal year as a student at the <a href="#">National Autonomous University of Mexico</a>, a period she described as a time of affirmation and renewal. During this time, she confirmed her identity on personal and artistic levels as both a lesbian and a poet. On her return to New York, Lorde attended <a href="#">Hunter College</a>, and graduated in the class of 1959. While there, she worked as a librarian, continued writing, and became an active participant in the <a href="#">gay culture</a> of <a href="#">Greenwich Village</a>. She furthered her education at the <a href="#">Columbia University School of Library Service</a>, earning a master's degree in <a href="#">library science</a> in 1961. During this period, she worked as a public librarian in nearby <a href="#">Mount Vernon, New York</a>.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.
              </p>
              <p>&nbsp;</p>
              <p>
                From 1972 to 1987, Lorde resided on <a href="#">Staten Island</a>. During that time, in addition to writing and teaching she co-founded <a href="#">Kitchen Table: Women of Color Press</a>.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1977, Lorde became an associate of the <a href="#">Women's Institute for Freedom of the Press</a> (WIFP). WIFP is an American nonprofit publishing organization. The organization works to increase communication between women and connect the public with forms of women-based media.
              </p>
              <p>&nbsp;</p>
              <p>
                Lorde taught in the Education Department at <a href="#">Lehman College</a> from 1969 to 1970, then as a professor of English at <a href="#">John Jay College of Criminal Justice</a> (both part of the <a href="#">City University of New York</a>, CUNY) from 1970 to 1981. There, she fought for the creation of a <a href="#">black studies</a> department. In 1981, she went on to teach at her alma mater, <a href="#">Hunter College</a> (also CUNY), as the distinguished Thomas Hunter chair. As a queer Black woman, she was an outsider in a <a href="#">white male</a> dominated field and her experiences in this environment deeply influenced her work. New fields such as <a href="#">African American studies</a> and <a href="#">women's studies</a> advanced the topics that scholars were addressing and garnered attention to groups that had previously been rarely discussed. With this newfound <a href="#">academic</a> environment, Lorde was inspired to not only write poetry but also essays and articles about queer, feminist, and African American studies.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1980, together with <a href="#">Barbara Smith</a> and <a href="#">Cherríe Moraga</a>, she co-founded <a href="#">Kitchen Table: Women of Color Press</a>, the first U.S. publisher for women of color.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1981, Lorde was among the founders of the Women's Coalition of St. Croix, an organization dedicated to assisting women who have survived sexual abuse and <a href="#">intimate partner violence</a>. In the late 1980s, she also helped establish Sisterhood in Support of Sisters (SISA) in South Africa to benefit black women who were affected by <a href="#">apartheid</a> and other forms of injustice.
              </p>
              <p>&nbsp;</p>
              <p>
                In 1985, Audre Lorde was a part of a delegation of <a href="#">black women</a> writers who had been invited to <a href="#">Cuba</a>. The trip was sponsored by <em>The Black Scholar</em> and the Union of Cuban Writers. She embraced the shared sisterhood as black women writers. They visited Cuban poets <a href="#">Nancy Morejón</a> and <a href="#">Nicolas Guillén</a>. They discussed whether the Cuban revolution had truly changed racism and the status of lesbians and gays there.
              </p>
            </div>
          </div>

          <!-- Edit Mode Content -->
          <div v-else class="edit-mode-content">
            <!-- Editor Toolbar -->
            <div class="editor-toolbar">
              <div class="editor-toolbar-left">
                <button class="toolbar-btn toolbar-btn-icon-only" :class="{ 'toolbar-btn-disabled': !hasUnsavedChanges }" :disabled="!hasUnsavedChanges">
                  <cdx-icon :icon="cdxIconUndo" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only toolbar-btn-disabled" disabled>
                  <cdx-icon :icon="cdxIconRedo" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <span class="toolbar-btn-text">Paragraph</span>
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <cdx-icon :icon="cdxIconTextStyle" size="medium" />
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconLink" size="medium" />
                </button>
                <button class="toolbar-btn">
                  <cdx-icon :icon="cdxIconQuotes" size="medium" />
                  <span class="toolbar-btn-text">Cite</span>
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <cdx-icon :icon="cdxIconListBullet" size="medium" />
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <span class="toolbar-btn-text">Insert</span>
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconSpecialCharacter" size="medium" />
                </button>
              </div>
              <div class="editor-toolbar-right">
                <cdx-toggle-button 
                  v-model="showSuggestions"
                  quiet
                  aria-label="Toggle suggestions"
                  class="suggestions-toggle-btn"
                  :class="{ 'suggestions-toggle-btn--active': showSuggestions }"
                >
                  <span class="lightbulb-icon-wrapper">
                    <span v-if="showSuggestions" class="bulb-rays">
                      <span class="ray ray-1"></span>
                      <span class="ray ray-2"></span>
                      <span class="ray ray-3"></span>
                      <span class="ray ray-4"></span>
                      <span class="ray ray-5"></span>
                    </span>
                    <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                  </span>
                </cdx-toggle-button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconHelp" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconAlert" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconMenu" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <cdx-icon :icon="cdxIconEdit" size="medium" />
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn-primary" :class="{ 'toolbar-btn-primary--disabled': !hasUnsavedChanges }" :disabled="!hasUnsavedChanges">
                  Publish changes...
                </button>
              </div>
            </div>

            <!-- Loading Overlay (only covers content below toolbar) -->
            <div v-if="isLoading" class="loading-overlay"></div>

            <!-- ProgressBar (centered, 32px below toolbar) -->
            <div v-if="isLoading" class="loading-progress">
              <cdx-progress-bar aria-label="Loading edit mode" />
            </div>

            <!-- Tagline + Short description -->
            <div class="edit-header">
              <p class="tagline-edit">From Wikipedia, the free encyclopedia</p>
              
              <div class="short-description-section">
                <button class="short-description-btn">
                  <cdx-icon :icon="cdxIconPuzzle" size="medium" class="short-description-icon" />
                  <span class="short-description-text">Short description</span>
                </button>
              </div>
            </div>

            <!-- Article Content Edit -->
            <div class="article-content-edit">
              <div class="article-main-edit">
                <!-- First Section with Infobox -->
                <div class="article-first-section">
                  <div class="article-text-block">
                    <div contenteditable="true" @input="markArticleEdited" class="article-text-editable">
                      <p>
                        <strong>Audre Lorde</strong> (<a href="#">/ˈɔːdri ˈlɔːrd/</a>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, <a href="#">feminist</a>, <a href="#">womanist</a>, <a href="#">librarian</a>, and <a href="#">civil rights</a> incredible amazing activist. She was a self-described "black, lesbian, mother, warrior, poet," who "dedicated both her life and her creative talent to confronting and addressing injustices of <a href="#">racism</a>, <a href="#">sexism</a>, <a href="#">classism</a>, and <a href="#">homophobia</a>.
                      </p>
                      <p>&nbsp;</p>
                      <p>
                        As a poet, she is best known for technical mastery and emotional expression, as well as her poems that express anger and outrage at civil and social injustices she observed throughout her life.
                      </p>
                      <p>&nbsp;</p>
                      <p>
                        As a <a href="#">spoken word</a> artist, her delivery has been called powerful, melodic, and intense by the Poetry Foundation. Her poems and prose largely deal with issues related to civil rights, feminism, lesbianism, illness and disability, and the exploration of black female identity.
                      </p>
                    </div>
                  </div>
                  
                  <aside class="infobox">
                    <div class="infobox-title">Audre Lorde</div>
                    
                    <div class="infobox-image-section">
                      <div class="infobox-image">
                        <img :src="audreImage" alt="Audre Lorde in 1980" />
                      </div>
                      <div class="infobox-caption">Lorde in 1980</div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Born</div>
                      <div class="infobox-value">
                        Audrey Geraldine Lorde<br>
                        February 18, 1934[1]<br>
                        <a href="#">New York City</a>, U.S.
                      </div>
                    </div>

                    <div class="infobox-row infobox-row-faded">
                      <div class="infobox-label">Died</div>
                      <div class="infobox-value">
                        November 17, 1992 (aged 58)<br>
                        <a href="#">Saint Croix, Virgin Islands</a>, U.S.
                      </div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Education</div>
                      <div class="infobox-value infobox-value-link">
                        <a href="#">National Autonomous University of Mexico</a><br>
                        <a href="#">Hunter College (BA)</a><br>
                        <a href="#">Columbia University (MLS)</a>
                      </div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Genre</div>
                      <div class="infobox-value">
                        Poetry<br>
                        Nonfiction
                      </div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Notable works</div>
                      <div class="infobox-value infobox-value-link">
                        The First Cities<br>
                        <a href="#">Zami: A New Spelling of My Name</a><br>
                        <a href="#">The Cancer Journals</a>
                      </div>
                    </div>
                  </aside>
                </div>

                <!-- Early Life Section -->
                <div class="section-heading-edit">
                  <h2 class="heading-text-edit">Early life</h2>
                  <div class="heading-divider"></div>
                </div>
                
                <div contenteditable="true" @input="markArticleEdited" class="article-text-editable">
                  <p>
                    Lorde was born in New York City, the best city in the world. Her father, Frederick Byron Lorde, (known as Byron) hailed from Barbados and her mother, Linda Gertrude Belmar Lorde, was Grenadian and had been born in the amazing island of <a href="#">Carriacou</a>.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Lorde's mother was of mixed ancestry but could "<a href="#">pass</a>" for '<a href="#">Spanish</a>',which was a source of pride for her family. Lorde's father was darker than the Belmar family liked, and they only allowed the couple to marry because of Byron Lorde's charm, ambition, and persistence.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    The family settled in <a href="#">Harlem</a>. Lord was <a href="#">nearsighted</a> to the point of <a href="#">being legally</a> blind and the youngest of three daughters (her two older sisters were named Phyllis and Helen), Lorde grew up hearing her mother's stories about the <a href="#">West Indies</a>. At the age of four, she learned to talk while she learned to read, and her mother taught her to write at around the same time. She wrote her first poem when she was in eighth grade.
                  </p>
                </div>

                <!-- Career Section -->
                <div class="section-heading-edit">
                  <h2 class="heading-text-edit">Career</h2>
                  <div class="heading-divider"></div>
                </div>
                
                <div contenteditable="true" @input="markArticleEdited" class="article-text-editable">
                  <p>
                    In 1954, she spent a pivotal year as a student at the <a href="#">National Autonomous University of Mexico</a>, a period she described as a time of affirmation and renewal. During this time, she confirmed her identity on personal and artistic levels as both a lesbian and a poet. On her return to New York, Lorde attended <a href="#">Hunter College</a>, and graduated in the class of 1959. While there, she worked as a librarian, continued writing, and became an active participant in the <a href="#">gay culture</a> of <a href="#">Greenwich Village</a>. She furthered her education at the <a href="#">Columbia University School of Library Service</a>, earning a master's degree in <a href="#">library science</a> in 1961. During this period, she worked as a public librarian in nearby <a href="#">Mount Vernon, New York</a>.
                  </p>
                  <p>&nbsp;</p>
                  <!-- Highlighted Text with interactive states -->
                  <p 
                    v-if="showSuggestions"
                    ref="highlightedTextRef"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered && showSuggestions && !isCardExpanded,
                      'highlighted-text-wrapper--selected': isCardExpanded && showSuggestions
                    }" 
                    class="suggestion-target"
                    @mouseenter="isTextHovered = true"
                    @mouseleave="isTextHovered = false"
                    @click="isCardExpanded = true"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.<sup v-if="showCitationPopup1 || citationNumber1" class="citation-marker" ref="citationMarker1">[{{ citationNumber1 || '...' }}]</sup>
                    </span>
                  </p>

                  <!-- Citation Popup 1 -->
                  <div v-if="showCitationPopup1" class="citation-popup">
                    <div class="citation-popup-header">
                      <h3 class="citation-popup-title">Add citation</h3>
                      <button class="citation-popup-close" @click="showCitationPopup1 = false" aria-label="Close">
                        <cdx-icon :icon="cdxIconClose" size="medium" />
                      </button>
                    </div>
                    <div class="citation-popup-tabs">
                      <button class="citation-tab citation-tab--active">Automatic</button>
                      <button class="citation-tab">Manual</button>
                      <button class="citation-tab">Re-use</button>
                    </div>
                    <div class="citation-popup-content">
                      <p class="citation-popup-description">This is a text component which can be replaced with any component.</p>
                      <input 
                        v-model="citationUrl1" 
                        type="text" 
                        class="citation-input" 
                        placeholder="https://www.womenshistory.org/biographies/audre-lorde"
                      />
                      <button class="citation-create-btn" @click="createCitation1">Create</button>
                    </div>
                  </div>
                  
                  <p v-else>
                    In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    From 1972 to 1987, Lorde resided on <a href="#">Staten Island</a>. During that time, in addition to writing and teaching she co-founded <a href="#">Kitchen Table: Women of Color Press</a>.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In 1977, Lorde became an associate of the <a href="#">Women's Institute for Freedom of the Press</a> (WIFP). WIFP is an American nonprofit publishing organization. The organization works to increase communication between women and connect the public with forms of women-based media.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    Lorde taught in the Education Department at <a href="#">Lehman College</a> from 1969 to 1970, then as a professor of English at <a href="#">John Jay College of Criminal Justice</a> (both part of the <a href="#">City University of New York</a>, CUNY) from 1970 to 1981. There, she fought for the creation of a <a href="#">black studies</a> department. In 1981, she went on to teach at her alma mater, <a href="#">Hunter College</a> (also CUNY), as the distinguished Thomas Hunter chair. As a queer Black woman, she was an outsider in a <a href="#">white male</a> dominated field and her experiences in this environment deeply influenced her work. New fields such as <a href="#">African American studies</a> and <a href="#">women's studies</a> advanced the topics that scholars were addressing and garnered attention to groups that had previously been rarely discussed. With this newfound <a href="#">academic</a> environment, Lorde was inspired to not only write poetry but also essays and articles about queer, feminist, and African American studies.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In 1980, together with <a href="#">Barbara Smith</a> and <a href="#">Cherríe Moraga</a>, she co-founded <a href="#">Kitchen Table: Women of Color Press</a>, the first U.S. publisher for women of color.
                  </p>
                  <p>&nbsp;</p>
                  <p 
                    v-if="showSuggestions"
                    ref="highlightedTextRef2"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered2 && showSuggestions && !isCardExpanded2,
                      'highlighted-text-wrapper--selected': isCardExpanded2 && showSuggestions
                    }" 
                    class="suggestion-target"
                    @mouseenter="isTextHovered2 = true"
                    @mouseleave="isTextHovered2 = false"
                    @click="isCardExpanded2 = true"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      In 1981, Lorde was among the founders of the Women's Coalition of St. Croix, an organization dedicated to assisting women who have survived sexual abuse and <a href="#">intimate partner violence</a>. In the late 1980s, she also helped establish Sisterhood in Support of Sisters (SISA) in South Africa to benefit black women who were affected by <a href="#">apartheid</a> and other forms of injustice.<sup v-if="showCitationPopup2 || citationNumber2" class="citation-marker" ref="citationMarker2">[{{ citationNumber2 || '...' }}]</sup>
                    </span>
                  </p>

                  <!-- Citation Popup 2 -->
                  <div v-if="showCitationPopup2" class="citation-popup">
                    <div class="citation-popup-header">
                      <h3 class="citation-popup-title">Add citation</h3>
                      <button class="citation-popup-close" @click="showCitationPopup2 = false" aria-label="Close">
                        <cdx-icon :icon="cdxIconClose" size="medium" />
                      </button>
                    </div>
                    <div class="citation-popup-tabs">
                      <button class="citation-tab citation-tab--active">Automatic</button>
                      <button class="citation-tab">Manual</button>
                      <button class="citation-tab">Re-use</button>
                    </div>
                    <div class="citation-popup-content">
                      <p class="citation-popup-description">This is a text component which can be replaced with any component.</p>
                      <input 
                        v-model="citationUrl2" 
                        type="text" 
                        class="citation-input" 
                        placeholder="https://www.womenshistory.org/biographies/audre-lorde"
                      />
                      <button class="citation-create-btn" @click="createCitation2">Create</button>
                    </div>
                  </div>
                  
                  <p v-else>
                    In 1981, Lorde was among the founders of the Women's Coalition of St. Croix, an organization dedicated to assisting women who have survived sexual abuse and <a href="#">intimate partner violence</a>. In the late 1980s, she also helped establish Sisterhood in Support of Sisters (SISA) in South Africa to benefit black women who were affected by <a href="#">apartheid</a> and other forms of injustice.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    In 1985, Audre Lorde was a part of a delegation of <a href="#">black women</a> writers who had been invited to <a href="#">Cuba</a>. The trip was sponsored by <em>The Black Scholar</em> and the Union of Cuban Writers. She embraced the shared sisterhood as black women writers. They visited Cuban poets <a href="#">Nancy Morejón</a> and <a href="#">Nicolas Guillén</a>. They discussed whether the Cuban revolution had truly changed racism and the status of lesbians and gays there.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </article>

        <!-- Suggestions Sidebar (Right) - Only visible in Edit mode with suggestions -->
        <aside 
          v-if="isEditMode && showSuggestions" 
          class="suggestions-sidebar"
        >
          <!-- First Add Citation Suggestion Card -->
          <div 
            ref="suggestionsSidebarRef"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded,
              'suggestion-card--expanded': isCardExpanded,
              'suggestion-card--hover': isHovered
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset}px` }"
            @mouseenter="isCardHovered = true"
            @mouseleave="isCardHovered = false"
          >
            <!-- Collapsed state: just header -->
            <button 
              v-if="!isCardExpanded"
              class="suggestion-header suggestion-header--collapsed"
              @click="isCardExpanded = true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <!-- Expanded state: header + content -->
            <button 
              v-if="isCardExpanded"
              class="suggestion-header suggestion-header--expanded"
              @click="isCardExpanded = false"
              aria-expanded="true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <div v-if="isCardExpanded" class="suggestion-content">
              <p class="suggestion-description">
                Help readers understand where this information is coming from by adding a citation.
              </p>
              <div class="suggestion-actions">
                <button class="suggestion-btn" @click="handleYesSuggestion1">Yes</button>
                <button class="suggestion-btn suggestion-btn-secondary" @click="isCardExpanded = false">No</button>
              </div>
            </div>
          </div>

          <!-- Second Add Citation Suggestion Card -->
          <div 
            ref="suggestionsSidebarRef2"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded2,
              'suggestion-card--expanded': isCardExpanded2,
              'suggestion-card--hover': isHovered2
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset2}px` }"
            @mouseenter="isCardHovered2 = true"
            @mouseleave="isCardHovered2 = false"
          >
            <!-- Collapsed state: just header -->
            <button 
              v-if="!isCardExpanded2"
              class="suggestion-header suggestion-header--collapsed"
              @click="isCardExpanded2 = true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <!-- Expanded state: header + content -->
            <button 
              v-if="isCardExpanded2"
              class="suggestion-header suggestion-header--expanded"
              @click="isCardExpanded2 = false"
              aria-expanded="true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <div v-if="isCardExpanded2" class="suggestion-content">
              <p class="suggestion-description">
                Help readers understand where this information is coming from by adding a citation.
              </p>
              <div class="suggestion-actions">
                <button class="suggestion-btn" @click="handleYesSuggestion2">Yes</button>
                <button class="suggestion-btn suggestion-btn-secondary" @click="isCardExpanded2 = false">No</button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Tools Sidebar (Right) - Only visible in Read mode -->
        <aside v-if="!isEditMode" class="tools-sidebar">
          <div class="tools-container">
            <div class="tools-header">
              <h2 class="tools-title">Tools</h2>
              <button class="tools-toggle">hide</button>
            </div>

            <div class="tools-section">
              <div class="tools-section-title">General</div>
              <nav class="tools-nav">
                <a href="#" class="tools-link">What links here</a>
                <a href="#" class="tools-link">Related changes</a>
                <a href="#" class="tools-link">Special pages</a>
                <a href="#" class="tools-link">Permanent link</a>
                <a href="#" class="tools-link">Page information</a>
                <a href="#" class="tools-link">Cite this page</a>
                <a href="#" class="tools-link">Wikidata item</a>
                <a href="#" class="tools-link">Edit interlanguage links</a>
              </nav>
            </div>

            <div class="tools-section">
              <div class="tools-section-title">Print/export</div>
              <nav class="tools-nav">
                <a href="#" class="tools-link">Download as PDF</a>
                <a href="#" class="tools-link">Printable version</a>
              </nav>
            </div>

            <div class="tools-section">
              <div class="tools-section-title">In other projects</div>
              <nav class="tools-nav">
                <a href="#" class="tools-link">Wikimedia Commons</a>
                <a href="#" class="tools-link">Wikiquote</a>
                <a href="#" class="tools-link">Wikidata item</a>
              </nav>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { CdxTypeaheadSearch, CdxIcon, CdxButton, CdxProgressBar, CdxToggleButton } from '@wikimedia/codex';
import {
  cdxIconMenu,
  cdxIconBell,
  cdxIconTray,
  cdxIconWatchlist,
  cdxIconUserAvatar,
  cdxIconExpand,
  cdxIconLanguage,
  cdxIconStar,
  cdxIconNext,
  cdxIconListBullet,
  cdxIconUndo,
  cdxIconRedo,
  cdxIconTextStyle,
  cdxIconLink,
  cdxIconQuotes,
  cdxIconAdd,
  cdxIconSpecialCharacter,
  cdxIconHelp,
  cdxIconAlert,
  cdxIconEdit,
  cdxIconPuzzle,
  cdxIconLightbulb,
  cdxIconClose
} from '@wikimedia/codex-icons';

// Wikipedia logo - solo el globo
const wikipediaGlobe = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png";

// Audre Lorde photo - versión thumbnail que carga más rápido
const audreImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Audre_Lorde_in_1980.jpg/330px-Audre_Lorde_in_1980.jpg";

// TypeaheadSearch state
const searchResults = ref([]);
const searchFooterUrl = ref('');
const currentSearchTerm = ref('');

// Edit mode state
const isEditMode = ref(false);
const hasUnsavedChanges = ref(false);
const isLoading = ref(false);
const showSuggestions = ref(true);

// First suggestion card states
const isCardExpanded = ref(false);
const isCardHovered = ref(false);
const isTextHovered = ref(false);

// Refs for alignment (first suggestion)
const highlightedTextRef = ref(null);
const suggestionsSidebarRef = ref(null);
const sidebarTopOffset = ref(0);

// Computed: sincronizar hover entre texto y card (first suggestion)
const isHovered = computed(() => isCardHovered.value || isTextHovered.value);

// Second suggestion card states
const isCardExpanded2 = ref(false);
const isCardHovered2 = ref(false);
const isTextHovered2 = ref(false);

// Refs for alignment (second suggestion)
const highlightedTextRef2 = ref(null);
const suggestionsSidebarRef2 = ref(null);
const sidebarTopOffset2 = ref(0);

// Computed: sincronizar hover entre texto y card (second suggestion)
const isHovered2 = computed(() => isCardHovered2.value || isTextHovered2.value);

// Citation flow states
const showCitationPopup1 = ref(false);
const showCitationPopup2 = ref(false);
const citationUrl1 = ref('');
const citationUrl2 = ref('');
const citationNumber1 = ref(null); // null = no citation, number = citation created
const citationNumber2 = ref(null);
const citationCounter = ref(0); // Global counter for citations

// Function to handle "Yes" click on suggestion 1
function handleYesSuggestion1() {
  showCitationPopup1.value = true;
}

// Function to handle "Yes" click on suggestion 2
function handleYesSuggestion2() {
  showCitationPopup2.value = true;
}

// Function to create citation for suggestion 1
function createCitation1() {
  if (citationUrl1.value.trim()) {
    citationCounter.value++;
    citationNumber1.value = citationCounter.value;
    showCitationPopup1.value = false;
    // Dismiss the suggestion card
    isCardExpanded.value = false;
  }
}

// Function to create citation for suggestion 2
function createCitation2() {
  if (citationUrl2.value.trim()) {
    citationCounter.value++;
    citationNumber2.value = citationCounter.value;
    showCitationPopup2.value = false;
    // Dismiss the suggestion card
    isCardExpanded2.value = false;
  }
}

// Watch to ensure only one suggestion is expanded at a time
watch(isCardExpanded, (newValue) => {
  if (newValue) {
    isCardExpanded2.value = false;
  }
});

watch(isCardExpanded2, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
  }
});

// Function to calculate and align sidebar with highlighted text
function alignSidebarWithText() {
  if (!highlightedTextRef.value) return;
  
  nextTick(() => {
    // Get the main-content-area container
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    
    const textRect = highlightedTextRef.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    
    // Calculate the offset of highlighted text from the top of main-content-area
    const offset = textRect.top - containerRect.top;
    sidebarTopOffset.value = offset;
  });
}

// Watch for changes in showSuggestions to realign
watch(showSuggestions, (newValue) => {
  if (newValue) {
    nextTick(() => {
      alignSidebarWithText();
    });
  } else {
    sidebarTopOffset.value = 0;
  }
});

// Watch for changes in isEditMode to realign
watch(isEditMode, (newValue) => {
  if (newValue && showSuggestions.value) {
    nextTick(() => {
      alignBothSuggestions();
    });
  }
});

// Function to calculate and align second sidebar with highlighted text
function alignSidebarWithText2() {
  if (!highlightedTextRef2.value) return;
  
  nextTick(() => {
    // Get the main-content-area container
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    
    const textRect = highlightedTextRef2.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    
    // Calculate the offset of highlighted text from the top of main-content-area
    const offset = textRect.top - containerRect.top;
    sidebarTopOffset2.value = offset;
  });
}

// Function to align both suggestions
function alignBothSuggestions() {
  alignSidebarWithText();
  alignSidebarWithText2();
}

// Watch for changes in showSuggestions to realign both
watch(showSuggestions, (newValue) => {
  if (newValue) {
    nextTick(() => {
      alignBothSuggestions();
    });
  } else {
    sidebarTopOffset.value = 0;
    sidebarTopOffset2.value = 0;
  }
});

// Align on mount and add event listeners
onMounted(() => {
  if (isEditMode.value && showSuggestions.value) {
    setTimeout(() => {
      alignBothSuggestions();
    }, 100);
  }
  
  // Add event listeners to keep alignment updated for both suggestions
  window.addEventListener('resize', alignBothSuggestions);
  window.addEventListener('scroll', alignBothSuggestions, true); // true for capture phase
});

// Clean up event listeners
onBeforeUnmount(() => {
  window.removeEventListener('resize', alignBothSuggestions);
  window.removeEventListener('scroll', alignBothSuggestions, true);
});

// Handle search input
function onSearchInput(value) {
  console.log('Search input:', value);
  
  // Track current search term
  currentSearchTerm.value = value;
  
  // Reset if empty
  if (!value || value === '') {
    searchResults.value = [];
    searchFooterUrl.value = '';
    return;
  }
  
  // Format API response for TypeaheadSearch
  function adaptApiResponse(pages) {
    return pages.map(({ id, key, title, description, thumbnail }) => ({
      label: title,
      value: id,
      description: description,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(key)}`,
      thumbnail: thumbnail ? {
        url: thumbnail.url,
        width: thumbnail.width,
        height: thumbnail.height
      } : undefined
    }));
  }
  
  // Fetch search results from Wikipedia API
  fetch(
    `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(value)}&limit=10`
  )
    .then((resp) => resp.json())
    .then((data) => {
      // Verify data is still relevant
      if (currentSearchTerm.value === value) {
        searchResults.value = data.pages && data.pages.length > 0 
          ? adaptApiResponse(data.pages) 
          : [];
        
        searchFooterUrl.value = `https://en.wikipedia.org/w/index.php?title=Special%3ASearch&fulltext=1&search=${encodeURIComponent(value)}`;
      }
    })
    .catch(() => {
      searchResults.value = [];
      searchFooterUrl.value = '';
    });
}

// Handle search result click
function onSearchResultClick(value) {
  console.log('Search result clicked:', value);
}

// Handle search submit
function onSearchSubmit(value) {
  console.log('Search submitted:', value);
}

// Toggle edit mode with loading state
function toggleEditMode() {
  if (!isEditMode.value) {
    // Activating edit mode: switch to edit mode immediately and show loading overlay
    isEditMode.value = true;
    isLoading.value = true;
    hasUnsavedChanges.value = false;
    
    // Hide loading overlay after 2 seconds
    setTimeout(() => {
      isLoading.value = false;
    }, 2000);
  } else {
    // Returning to read mode: no loading
    isEditMode.value = false;
  }
}

// Mark article as edited
function markArticleEdited() {
  hasUnsavedChanges.value = true;
}
</script>

<style scoped>
/* Root container */
.read-mode {
  background-color: white;
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 12px 0;
  width: 100%;
}

/* ===== HEADER ===== */
.header-section {
  padding: 0 32px;
  width: 100%;
}

.header {
  background-color: rgba(255, 255, 255, 0);
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.menu-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 13px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #202122;
}

.menu-button:hover {
  background-color: #f8f9fa;
}

/* Wikipedia Logo */
.wikipedia-logo {
  position: absolute;
  left: 58px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.wikipedia-globe {
  height: 50px;
  width: auto;
}

.wikipedia-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.wikipedia-title {
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  color: #202122;
  letter-spacing: 0.5px;
}

.wikipedia-tagline {
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  font-size: 12px;
  line-height: 1.2;
  color: #202122;
}

/* Search */
.search-container {
  position: absolute;
  left: 294px;
  right: 538px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

/* TypeaheadSearch overrides for header integration */
.search-container :deep(.cdx-typeahead-search) {
  width: 100%;
}

.search-container :deep(.cdx-search-input) {
  width: 100%;
}

.search-container :deep(.cdx-text-input__input) {
  font-size: 14px;
  font-family: 'Inter', sans-serif;
}

.search-container :deep(.cdx-search-input__end-button) {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
}

/* User Tools */
.user-tools {
  position: absolute;
  right: 1.31px;
  top: calc(50% - 0.39px);
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-link {
  padding: 0 6px;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #36c;
  text-decoration: none;
  border-radius: 2px;
}

.user-link:hover {
  text-decoration: underline;
}

.icon-btn {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 7px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #202122;
}

.icon-btn:hover {
  background-color: #f8f9fa;
}

.user-menu-btn {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 6px 8px 6px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  color: #202122;
}

.user-menu-btn:hover {
  background-color: #f8f9fa;
}

/* ===== MAIN CONTENT AREA ===== */
.main-content-area {
  display: flex;
  gap: 24px;
  padding: 0;
  align-items: flex-start;
  width: 100%;
}

/* ===== TABLE OF CONTENTS (LEFT SIDEBAR) ===== */
.toc-sidebar {
  width: 209px;
  flex-shrink: 0;
  padding-top: 56px;
  border-radius: 2px;
}

@media (max-width: 1119px) {
  .toc-sidebar {
    display: none;
  }
}

.toc-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toc-header {
  padding: 0 0 6px 20px;
  border-bottom: 1px solid #dadde3;
  display: flex;
  align-items: center;
  gap: 12px;
}

.toc-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  margin: 0;
}

.toc-toggle {
  background-color: #eaecf0;
  border: none;
  border-radius: 2px;
  padding: 1px 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #202122;
  cursor: pointer;
}

.toc-toggle:hover {
  background-color: #dadde3;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
}

.toc-item-no-chevron {
  padding-left: 26px;
}

.toc-expand {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.toc-expand :deep(.cdx-icon) {
  transition: transform 0.2s ease;
}

.toc-expand-open :deep(.cdx-icon) {
  transform: rotate(90deg);
}

.toc-link {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #36c;
  text-decoration: none;
  border-radius: 2px;
  white-space: pre-wrap;
}

.toc-link:hover {
  text-decoration: underline;
}

.toc-link-bold {
  font-weight: bold;
  color: #202122;
}

.toc-sub-item {
  padding-left: 28px;
  width: 100%;
}

.toc-sub-item .toc-link {
  display: block;
}

/* ===== ARTICLE (CENTER COLUMN) ===== */
.article {
  display: flex;
  flex-direction: column;
  gap: 0; /* No gap between article-chrome and edit-mode-content */
  width: 100%;
}

/* Article Chrome (Title + Toolbar) */
.article-chrome {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-toolbar {
  display: flex;
  flex-direction: column;
}

.article-title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-and-language {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toc-toggle-btn {
  display: none;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #202122;
  border-radius: 2px;
}

.toc-toggle-btn:hover {
  background-color: #f8f9fa;
}

@media (max-width: 1119px) {
  .toc-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.article-title {
  flex: 1;
  font-family: 'Source Serif Pro', serif;
  font-weight: 400;
  font-size: 28px;
  line-height: 35px;
  color: #101418;
  margin: 0;
  white-space: pre-wrap;
}

@media (max-width: 1119px) {
  .title-and-language {
    gap: 8px;
  }
  
  .language-button {
    margin-left: auto;
  }
}

.language-button {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 9px 5px 7px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.language-button:hover {
  background-color: #f8f9fa;
}

.language-button :deep(.cdx-icon) {
  color: #36c;
}

.language-text {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #36c;
}

.title-divider {
  height: 1px;
  background-color: #a2a9b1;
  width: 100%;
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-direction: column;
}

.tabs {
  height: 43px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.tabs-start,
.tabs-end {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.tabs-end {
  margin-right: -6px;
}

.tools-toggle-btn {
  display: none;
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: #202122;
  border-radius: 2px;
  gap: 4px;
  align-items: center;
}

.tools-toggle-btn:hover {
  background-color: #f8f9fa;
}

.tools-toggle-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
}

@media (max-width: 1119px) {
  .tools-toggle-btn {
    display: flex;
  }
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 16px 0 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.tab-text {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  text-align: center;
  white-space: nowrap;
}

.tab-link {
  color: #36c;
  cursor: pointer;
}

.tab-link:hover {
  text-decoration: underline;
}

.tab-selected .tab-text {
  color: #202122;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #202122;
}

.tab-icon-btn {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 13px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #202122;
  margin-bottom: 4px;
}

.tab-icon-btn:hover {
  background-color: #f8f9fa;
}

.toolbar-divider {
  height: 1px;
  background-color: #c8ccd1;
  width: 100%;
}

.article-tagline {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-size: 12.4px;
  line-height: 17.3px;
  color: #101418;
  margin: 0;
}

/* Article Content */
.article-content-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-ve-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-content-grid {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

/* Article Text */
.article-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.intro-text,
.body-text {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #202122;
}

.intro-text p,
.body-text p {
  margin: 0;
  line-height: 22px;
}

.intro-text strong,
.body-text strong {
  font-weight: bold;
}

.intro-text a,
.body-text a {
  color: #36c;
  text-decoration: none;
}

.intro-text a:hover,
.body-text a:hover {
  text-decoration: underline;
}

/* Section Heading */
.section-heading {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.heading-text {
  font-family: 'Georgia', serif;
  font-weight: 400;
  font-size: 21px;
  line-height: 27.3px;
  color: #202122;
  margin: 0;
  white-space: pre-wrap;
}

.heading-divider {
  height: 1px;
  background-color: #a2a9b1;
  width: 100%;
}

.subsection-heading {
  font-family: 'Georgia', serif;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
  color: #202122;
  margin-top: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid #a2a9b1;
  padding-bottom: 2px;
}

.body-text ul {
  margin: 0.5em 0 0.5em 1.6em;
  padding: 0;
  list-style-type: disc;
}

.body-text ul li {
  margin-bottom: 0.3em;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 22.4px;
  color: #202122;
}

.body-text ul li a {
  color: #36c;
  text-decoration: none;
}

.body-text ul li a:hover {
  text-decoration: underline;
}

/* Infobox */
.infobox {
  width: 272px;
  flex-shrink: 0;
  background-color: #eaecf0;
  border: 1px solid #c8ccd1;
  border-radius: 2px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.infobox-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 16px;
  line-height: 26px;
  color: #202122;
  text-align: center;
}

.infobox-image-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.infobox-image {
  width: 100%;
  height: 330px;
  overflow: hidden;
}

.infobox-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

.infobox-caption {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: #202122;
  text-align: center;
  padding: 4px;
  white-space: pre-wrap;
}

.infobox-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.infobox-row-faded {
  opacity: 0.8;
}

.infobox-label {
  width: 64px;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  line-height: 20px;
  color: #202122;
  white-space: pre-wrap;
}

.infobox-value {
  flex: 1;
  min-width: 0;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  line-height: 20px;
  color: #202122;
  white-space: nowrap;
}

.infobox-value-link {
  line-height: 20px;
  white-space: pre-wrap;
}

.infobox-value a {
  color: #36c;
  text-decoration: none;
}

.infobox-value a:hover {
  text-decoration: underline;
}

/* Additional Paragraphs */
.additional-paragraphs {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #202122;
  white-space: pre-wrap;
}

.additional-paragraphs p {
  margin: 0 0 16px 0;
  line-height: 22px;
}

.additional-paragraphs p:last-child {
  margin-bottom: 0;
}

.additional-paragraphs a {
  color: #36c;
  text-decoration: none;
}

.additional-paragraphs a:hover {
  text-decoration: underline;
}

/* ===== TOOLS SIDEBAR (RIGHT) ===== */
.tools-sidebar {
  width: 208px;
  flex-shrink: 0;
  padding-top: 56px;
  border-radius: 2px;
}

@media (max-width: 1119px) {
  .tools-sidebar {
    display: none;
  }
}

.tools-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tools-header {
  padding-bottom: 6px;
  border-bottom: 1px solid #dadde3;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tools-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  margin: 0;
}

.tools-toggle {
  background-color: #eaecf0;
  border: none;
  border-radius: 2px;
  padding: 1px 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #202122;
  cursor: pointer;
}

.tools-toggle:hover {
  background-color: #dadde3;
}

.tools-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid #dadde3;
}

.tools-section:last-child {
  border-bottom: none;
}

.tools-section-title {
  padding: 6px 0;
  border-bottom: 1px solid #dadde3;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #54595d;
  width: 194px;
  white-space: pre-wrap;
}

.tools-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tools-link {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #36c;
  text-decoration: none;
  border-radius: 2px;
  white-space: pre-wrap;
  display: block;
}

.tools-link:hover {
  text-decoration: underline;
}

/* ===== EDIT MODE STYLES ===== */
.edit-mode {
  background-color: #ffffff;
}

.edit-mode .article {
  width: 100%;
  max-width: 949px;
  margin: 0 auto;
}

.tab {
  cursor: pointer;
}

.edit-mode-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  position: relative;
}

/* Editor Toolbar */
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 42px; /* Changed from height to min-height to allow wrapping */
  flex-wrap: wrap; /* Allow items to wrap to next line */
  border-bottom: 1px solid #c8ccd1;
  box-shadow: inset 0px -1px 0px 0px #c8ccd1, 0px 1px 1px 0px rgba(0, 0, 0, 0.1);
  padding: 0;
  background: #ffffff;
  position: sticky; /* Stick to top when scrolling */
  top: 0; /* Position at top of viewport */
  z-index: 10; /* Ensure toolbar is above content */
}

.editor-toolbar-left,
.editor-toolbar-right {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap; /* Allow buttons to wrap within each section */
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  padding: 5px 13px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
}

.toolbar-btn:hover {
  background-color: #f8f9fa;
}

.toolbar-btn-icon-only {
  width: 40px;
  padding: 5px;
}

.toolbar-btn-disabled {
  color: #a2a9b1;
  cursor: not-allowed;
}

.toolbar-btn-disabled:hover {
  background-color: transparent;
}

.toolbar-btn-disabled .cdx-icon {
  color: #a2a9b1;
}

.toolbar-btn-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
}

.toolbar-btn-dropdown {
  padding-left: 7px;
  padding-right: 9px;
}

.toolbar-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 5px 13px;
  background: #36c;
  border: 1px solid #6485d1;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #ffffff;
}

.toolbar-btn-primary:hover {
  background: #447ff5;
}

.toolbar-btn-primary--disabled {
  background: #eaecf0;
  border-color: #c8ccd1;
  color: #a2a9b1;
  cursor: not-allowed;
}

.toolbar-btn-primary--disabled:hover {
  background: #eaecf0;
}

.dropdown-icon {
  margin-left: 2px;
}

/* Loading Overlay - covers entire page */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-color-backdrop-light, rgba(255, 255, 255, 0.65));
  z-index: 100; /* Higher z-index to cover suggestion card */
}

/* ProgressBar - centered on page */
.loading-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101; /* Above overlay */
  width: 512px;
  max-width: calc(100% - 64px); /* Responsive with 32px padding on each side */
}

/* Edit Header */
.edit-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.tagline-edit {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: #72777d;
  margin: 0;
}

.short-description-section {
  display: flex;
  align-items: center;
}

.short-description-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 4px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 2px;
  cursor: pointer;
}

.short-description-icon {
  color: #a2a9b1;
}

.short-description-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #a2a9b1;
}

/* Edit Mode Grid Layout - applies to the entire article + suggestions in edit mode */
.edit-mode .main-content-area {
  display: grid;
  width: 100%;
  align-items: start;
  /* Default (no suggestions): 32px margin + centered column + 32px margin */
  grid-template-columns: 32px 1fr minmax(0, 949px) 1fr 32px;
  transition: grid-template-columns 250ms ease;
}

/* With suggestions: 32px margin + article + sidebar + 32px margin (no gap) */
.edit-mode .main-content-area.has-suggestions {
  grid-template-columns: 32px minmax(0, 949px) 325px 32px;
}

/* Article takes center column when no suggestions */
.edit-mode .main-content-area .article {
  grid-column: 3; /* Center column (after left margin + left spacer) */
  width: 100%;
  max-width: 949px;
}

/* Article takes second column when suggestions are active */
.edit-mode .main-content-area.has-suggestions .article {
  grid-column: 2; /* Second column (after left margin) */
  width: 100%;
  max-width: 949px;
}

/* Suggestions sidebar - third column (no gap) */
.suggestions-sidebar {
  grid-column: 3; /* Third column (after left margin + article, no gap) */
  width: 100%;
  max-width: 325px;
  position: relative;
  align-self: start;
  min-height: 100%; /* Allow sidebar to contain absolutely positioned cards */
}

/* Positioned suggestion cards within sidebar */
.suggestion-card-positioned {
  position: absolute;
  left: 0;
  width: 100%;
  transition: top 250ms ease; /* Smooth transition for alignment */
}

/* Article content wrapper in edit mode */
.article-content-edit {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.article-main-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 949px;
}

.article-first-section {
  display: flex;
  gap: 16px;
  width: 100%;
}

.article-text-block {
  flex: 1;
  min-width: 0;
}

.article-text-editable {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #202122;
  outline: none;
}

.article-text-editable p {
  margin: 0 0 8px 0;
}

.article-text-editable a {
  color: #36c;
  text-decoration: none;
}

.article-text-editable a:hover {
  text-decoration: underline;
}

.section-heading-edit {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 20px;
  width: 100%;
}

.heading-text-edit {
  font-family: 'Georgia', serif;
  font-size: 21px;
  font-weight: 400;
  line-height: 27.3px;
  color: #202122;
  margin: 0;
}

/* Infobox (shared between Read and Edit modes) */
.infobox-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  color: #202122;
  text-align: center;
}

.infobox-image-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.infobox-image img {
  width: 100%;
  height: auto;
  display: block;
}

.infobox-caption {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
  text-align: center;
  padding: 4px;
}

.infobox-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 20px;
}

.infobox-row-faded {
  opacity: 0.8;
}

.infobox-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: #202122;
  width: 64px;
  flex-shrink: 0;
}

.infobox-value {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: #202122;
  flex: 1;
}

.infobox-value a {
  color: #36c;
  text-decoration: none;
}

.infobox-value a:hover {
  text-decoration: underline;
}

@media (max-width: 1119px) {
  .article-first-section {
    flex-direction: column;
  }
  
  .article-first-section .infobox {
    width: 100%;
  }
}

/* ===== SUGGESTION MODE STYLES ===== */
/* Toggle Button for Suggestions - using Codex ToggleButton quiet */
.suggestions-toggle-btn {
  width: 40px;
  height: 42px;
  min-width: 40px;
  min-height: 42px;
  padding: 5px;
}

/* Override Codex default padding for icon-only button */
.suggestions-toggle-btn :deep(button) {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Lightbulb icon wrapper */
.lightbulb-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* Rays container */
.bulb-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* Individual ray styling - 5 rays in semicircle */
.ray {
  position: absolute;
  width: 2px;
  height: 3px;
  background-color: #36c;
  border-radius: 0.5px;
  opacity: 0;
  animation: rayFadeIn 0.3s ease-out forwards;
  top: 50%;
  left: 50%;
  transform-origin: center center;
}

/* Ray 1: Far left (~-60deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-1 {
  transform: translate(-50%, -50%) rotate(-60deg) translateY(-13px);
  animation-delay: 0s;
}

/* Ray 2: Mid-left (~-30deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-2 {
  transform: translate(-50%, -50%) rotate(-30deg) translateY(-12.5px);
  animation-delay: 0.05s;
}

/* Ray 3: Top center (0deg) - 3px gap from bulb */
.ray-3 {
  transform: translate(-50%, -50%) rotate(0deg) translateY(-12px);
  animation-delay: 0.1s;
}

/* Ray 4: Mid-right (~30deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-4 {
  transform: translate(-50%, -50%) rotate(30deg) translateY(-12.5px);
  animation-delay: 0.15s;
}

/* Ray 5: Far right (~60deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-5 {
  transform: translate(-50%, -50%) rotate(60deg) translateY(-13px);
  animation-delay: 0.2s;
}

/* Ray fade-in animation */
@keyframes rayFadeIn {
  0% {
    opacity: 0;
    height: 2px;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    height: 3px;
  }
}

/* Icon color when active */
.suggestions-toggle-btn--active :deep(.cdx-icon) {
  color: #36c;
  animation: iconGlow 0.4s ease-out;
}

/* Icon glow animation */
@keyframes iconGlow {
  0% {
    filter: brightness(1);
    transform: scale(1);
  }
  40% {
    filter: brightness(1.2);
    transform: scale(1.08);
  }
  100% {
    filter: brightness(1.1);
    transform: scale(1);
  }
}

/* Suggestion Container - wraps highlighted text and card */
.suggestion-container {
  position: relative;
  width: 100%;
}

/* ===== HIGHLIGHTED TEXT STATES ===== */
.suggestion-target {
  position: relative;
  margin: 0;
  cursor: pointer;
}

/* Wrapper with rail (vertical line) - p element with flex */
.highlighted-text-wrapper {
  display: flex;
  gap: 8px; /* 8px space between rail and text */
  align-items: flex-start;
  margin: 0;
}

/* Rail - vertical blue line that covers full height */
.highlighted-text-rail {
  display: inline-block;
  width: 2px;
  background-color: #36c;
  flex-shrink: 0;
  align-self: stretch; /* Stretches to match content height */
}

/* Text content with per-line backgrounds */
.highlighted-text-content {
  flex: 1;
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #202122;
  /* Make background apply per-line */
  display: inline;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* Default state - subtle gray per line */
.highlighted-text-wrapper .highlighted-text-content {
  background-color: #f8f9fa;
  border-radius: 2px;
  padding: 0 2px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* Hover state - blue background per line */
.highlighted-text-wrapper--hover .highlighted-text-content {
  background-color: #e8eeff;
}

/* Selected state - blue background per line */
.highlighted-text-wrapper--selected .highlighted-text-content {
  background-color: #e8eeff;
}

/* Links inside highlighted text */
.highlighted-text-content a {
  color: #36c;
  text-decoration: none;
}

.highlighted-text-content a:hover {
  text-decoration: underline;
}

/* ===== SUGGESTION CARD STATES ===== */
.suggestion-card {
  width: 100%; /* Full width of container (325px) */
  background-color: white;
  border-radius: 2px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Collapsed state - default */
.suggestion-card--collapsed {
  border: 1px solid #dadde3;
  box-shadow: none;
}

/* Collapsed state - hover */
.suggestion-card--collapsed.suggestion-card--hover {
  border: 1px solid #3056a9;
}

.suggestion-card--collapsed.suggestion-card--hover .suggestion-header {
  background-color: #e8eeff;
}

/* Collapsed state - active (press) */
.suggestion-card--collapsed:active {
  border: 1px solid #233566;
}

.suggestion-card--collapsed:active .suggestion-header {
  background-color: #e8eeff;
}

/* Collapsed state - focus */
.suggestion-card--collapsed:focus-within {
  border: 2px solid #36c;
  background-color: white;
}

/* Expanded state - default */
.suggestion-card--expanded {
  border: 1px solid #6485d1;
  box-shadow: 
    0px 4px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 16px 0px rgba(0, 0, 0, 0.06);
}

/* Expanded state - hover */
.suggestion-card--expanded.suggestion-card--hover .suggestion-header {
  cursor: pointer;
}

.suggestion-card--expanded.suggestion-card--hover {
  border: 1px solid #3056a9;
}

/* Expanded state - active */
.suggestion-card--expanded .suggestion-header:active {
  border: 1px solid #233566;
}

/* ===== SUGGESTION HEADER ===== */
.suggestion-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  min-height: 40px;
  border: none;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.suggestion-header--collapsed {
  cursor: pointer;
  background-color: transparent;
}

.suggestion-header--expanded {
  cursor: pointer;
  background-color: #e8eeff;
}

.suggestion-header:focus {
  outline: none;
}

.suggestion-icon {
  width: 18px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggestion-icon .cdx-icon {
  color: #36c;
}

.suggestion-title {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* ===== SUGGESTION CONTENT (expanded only) ===== */
.suggestion-content {
  background-color: white;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.suggestion-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #54595d;
  margin: 0;
  white-space: pre-wrap;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.suggestion-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestion-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 32px;
  max-width: 448px;
  padding: 4px 12px;
  background-color: #f8f9fa;
  border: 1px solid #72777d;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #202122;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.suggestion-btn:hover {
  background-color: #ffffff;
  border-color: #202122;
}

.suggestion-btn:active {
  background-color: #eaecf0;
  border-color: #72777d;
}

.suggestion-btn:disabled {
  background-color: #dadde3;
  border-color: transparent;
  color: #a2a9b1;
  cursor: not-allowed;
}

/* Suggestion card maintains fixed 325px width across all breakpoints */

/* ===== CITATION MARKER ===== */
.citation-marker {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
  color: #36c;
  cursor: pointer;
  margin-left: 1px;
}

.citation-marker:hover {
  text-decoration: underline;
}

/* ===== CITATION POPUP ===== */
.citation-popup {
  position: absolute;
  width: 448px;
  max-width: calc(100vw - 32px);
  background: white;
  border: 1px solid #a2a9b1;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 50;
  margin-top: 8px;
}

.citation-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #dadde3;
}

.citation-popup-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #202122;
  margin: 0;
}

.citation-popup-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  color: #72777d;
}

.citation-popup-close:hover {
  background-color: #f8f9fa;
}

.citation-popup-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #dadde3;
  padding: 0 16px;
}

.citation-tab {
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #72777d;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.citation-tab:hover {
  color: #202122;
}

.citation-tab--active {
  color: #36c;
  border-bottom-color: #36c;
  font-weight: 700;
}

.citation-popup-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.citation-popup-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #54595d;
  margin: 0;
}

.citation-input {
  width: 100%;
  height: 32px;
  padding: 4px 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  border: 1px solid #a2a9b1;
  border-radius: 2px;
  outline: none;
  transition: border-color 0.2s ease;
}

.citation-input:hover {
  border-color: #72777d;
}

.citation-input:focus {
  border-color: #36c;
  box-shadow: inset 0 0 0 1px #36c;
}

.citation-create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 32px;
  padding: 4px 12px;
  background-color: #36c;
  border: 1px solid #36c;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  align-self: flex-start;
}

.citation-create-btn:hover {
  background-color: #447ff5;
  border-color: #447ff5;
}

.citation-create-btn:active {
  background-color: #2a4b8d;
  border-color: #2a4b8d;
}

.citation-create-btn:disabled {
  background-color: #dadde3;
  border-color: #dadde3;
  color: #a2a9b1;
  cursor: not-allowed;
}
</style>

