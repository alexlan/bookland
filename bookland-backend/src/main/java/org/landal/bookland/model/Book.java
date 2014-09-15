package org.landal.bookland.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.builder.ToStringBuilder;

@XmlRootElement(name = "book")
@Entity
@Table(name = "BOOKS")
@NamedQueries({ @NamedQuery(name = Book.DELETE_ALL, query = "delete from Book"),
		@NamedQuery(name = Book.DELETE, query = "delete from Book b where b.id = :id") })
public class Book extends BaseEntity {

	private static final long serialVersionUID = 1L;

	public static final String DELETE_ALL = "Book.deleteAll";
	public static final String DELETE = "Book.delete";

	private String isbn;
	private String title;
	private String description;

	@OneToMany(fetch = FetchType.EAGER)
	// @JoinColumn(name = "AUTHOR_ID", referencedColumnName = "ID")
	@JoinTable(name = "BOOKS_AUTHOR", joinColumns = { @JoinColumn(name = "BOOK_ID", referencedColumnName = "ID") }, inverseJoinColumns = { @JoinColumn(name = "AUTHOR_ID", referencedColumnName = "ID", unique = true) })
	private List<Author> authors;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	private byte[] image;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	private String review;

	protected Book(){}

	public Book(String isbn, String title, String description, Author... authors) {
		this.isbn = isbn;
		this.title = title;
		this.description = description;
		this.authors = Arrays.asList(authors);
	}

	public Book(Long id, String isbn, String title, String description, Author... authors) {
		super(id);
		this.isbn = isbn;
		this.title = title;
		this.description = description;
		this.authors = Arrays.asList(authors);
	}

	public String toString() {
		return new ToStringBuilder(this).append("id", getId()).append("isbn", getIsbn()).toString();
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Author> getAuthors() {
		if (authors == null) {
			authors = new ArrayList<Author>();
		}
		return Collections.unmodifiableList(authors);
	}

	public void setAuthors(List<Author> authors) {
		this.authors = authors;
	}

	public byte[] getImage() {
		return image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

}
